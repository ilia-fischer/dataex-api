package main

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"strconv"
)

type Account struct {
	Balance int    `json:"balance"`
	Owner   string `json:"owner"`
}

func initializeAccount(stub shim.ChaincodeStubInterface, accountId string) error {

	logger.Debugf("initializing account " + accountId)
	value, _ := stub.GetState("account" + accountId)

	if value != nil {
		logger.Debugf("account " + accountId + " already exist")
		return nil
	} else {
		logger.Debugf("about to put state " + accountId)
		return stub.PutState("account"+accountId, []byte("0"))
	}
}

func depositAccount(stub shim.ChaincodeStubInterface, accountId string, amount int) error {

	initializeAccount(stub, accountId)
	key := "account" + accountId
	balance, _ := stub.GetState(key)
	pBalance, err := strconv.Atoi(string(balance))
	if err != nil {
		logger.Debugf(err.Error())
		pBalance = 0
	}
	pBalance += amount
	logger.Debugf("previous balance " + string(balance) + " new balance " + strconv.Itoa(pBalance))
	return stub.PutState(key, []byte(strconv.Itoa(pBalance)))
}

/*
   returns the balance of a user's account
*/
func queryAccount(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	logger.Debugf("getting account balance for " + args[0])
	if len(args) != 1 {
		return shim.Error("Expect 1 parameter: account id")
	}
	value, err := stub.GetState("account" + args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	result := "{ \"owner\": \"" + args[0] + "\", \"balance\": \"" + string(value) + "\"}"
	logger.Debugf("account balance: " + result)
	return shim.Success([]byte(result))
}

/*
   returns the account history
*/
func getAccountHistory(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Debugf("getting acocunt history for " + args[0])
	return shim.Success([]byte("not implemented yet"))
}
