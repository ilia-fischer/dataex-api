package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"strconv"
)

type DataSet struct {
	Owner       string       `json:"owner"`
	Url         string       `json:"url"`
	Entitlement *Entitlement `json:"entitlement`
	CommPolicy  *CommPolicy
}

func addDataSet(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var logger = shim.NewLogger("dataex")

	fmt.Println("adding dataset")
	if len(args) != 1 {
		return shim.Error("expect json payload")
	}
	dataset := &DataSet{
		Entitlement: &Entitlement{},
		CommPolicy:  &CommPolicy{},
	}

	err := json.Unmarshal([]byte(args[0]), dataset)
	if err != nil {
		return shim.Error(err.Error())
	}
	jsonString, _ := json.Marshal(dataset)

	logger.Debugf(args[0])
	logger.Debugf(string(jsonString))
	err = stub.PutState(dataset.Url, jsonString)
	if err != nil {
		return shim.Error(err.Error())
	}
	addEntitlement(stub, args)

	value, gerr := stub.GetState(dataset.Url)
	if gerr != nil {
		return shim.Error(gerr.Error())
	}
	logger.Debugf("value from state store")
	logger.Debugf(string(value))

	aerr := initializeAccount(stub, dataset.Owner)
	if aerr != nil {
		logger.Debugf("failed initializing account " + dataset.Owner)
		return shim.Error(aerr.Error())
	}

	return shim.Success(jsonString)
}

func deleteDataSet(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	fmt.Println("removing dataset")

	removeEntitlement(stub, args)
	return shim.Success(nil)
}

/*
  returns an eccess token if user entitlement is valid
  access token will be recorded on the ledger
*/
func accessDataSet(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		logger.Debugf("Invalid number of args, expecting url and consumer")
		return shim.Error("Invalid number of args, expecting url and consumer")
	}
	logger.Debugf("accessing dataset: " + args[0] + " consumer: " + args[1])
	state, _ := stub.GetState(args[0])

	logger.Debugf(string(state))
	dataset := &DataSet{
		Entitlement: &Entitlement{},
		CommPolicy:  &CommPolicy{},
	}
	err := json.Unmarshal(state, dataset)
	if err != nil {
		logger.Debugf(err.Error())
		return shim.Error(err.Error())
	}

	//deposit to owner account
	logger.Debugf("deposit to " + dataset.Owner)
	err = depositAccount(stub, dataset.Owner, dataset.CommPolicy.Price)
	if err != nil {
		return shim.Error(err.Error())
	}
	//debit consumer account
	logger.Debugf("debit " + args[1])
	err = depositAccount(stub, args[1], dataset.CommPolicy.Price*(-1))
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte("successfully accessed dataset: " + args[0] + " deposited account: " + dataset.Owner + " amount: " + strconv.Itoa(dataset.CommPolicy.Price)))
}

func getDataSetHistory(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	key := args[0]
	history, err := stub.GetHistoryForKey(key)
	if err != nil {
		return shim.Error("Error retrieving dataset history")
	}

	resultMsg := []byte("result:")

	for history.HasNext() {
		history_item, _ := history.Next()
		fmt.Println(history_item.GetValue())
		resultMsg = history_item.GetValue()
	}

	return shim.Success(resultMsg)

}

/*
   Support complext query string (CouchDB json query syntax)
*/
func queryDataSet(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Debugf("-------------------------------------------- querying dataset %s", args[0])
	state, err := stub.GetQueryResult(args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	defer state.Close()

	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for state.HasNext() {
		queryResponse, err := state.Next()
		if err != nil {
			return shim.Error("error getting state")
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")
	return shim.Success(buffer.Bytes())
}
