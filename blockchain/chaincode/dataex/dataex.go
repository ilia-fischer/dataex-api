package main

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// DataExchangeCC example simple Chaincode implementation
type DataExchangeCC struct {
}

var logger = shim.NewLogger("dataex")

func (t *DataExchangeCC) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success([]byte("dataex successfully initiated."))
}

func (t *DataExchangeCC) Invoke(stub shim.ChaincodeStubInterface) pb.Response {

	function, args := stub.GetFunctionAndParameters()
	if function == "addDataSet" {
		// Make payment of X units from A to B
		return addDataSet(stub, args)
	} else if function == "deleteDataSet" {
		// Deletes an entity from its state
		return deleteDataSet(stub, args)
	} else if function == "accessDataSet" {
		// the old "Query" is now implemtned in invoke
		return accessDataSet(stub, args)
	} else if function == "getDataSetHistory" {
		// Make payment of X units from A to B
		return getDataSetHistory(stub, args)
	} else if function == "queryDataSet" {
		return queryDataSet(stub, args)
	} else if function == "queryAccount" {
		return queryAccount(stub, args)
	}

	return shim.Error("Invalid invoke function name. Expecting \"add\" \"delete\" \"access\" ver: 1.2")
}

func (t *DataExchangeCC) Query(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	if function == "getDataSetHistory" {
		// Make payment of X units from A to B
		return getDataSetHistory(stub, args)
	} else if function == "queryDataSet" {
		return queryDataSet(stub, args)
	}

	return shim.Error("Invalid invoke function name. Expecting \"getDataSetHistory\"")
}

func main() {
	err := shim.Start(new(DataExchangeCC))
	if err != nil {
		fmt.Printf("Error starting DataExchangeCC chaincode: %s", err)
	}
}
