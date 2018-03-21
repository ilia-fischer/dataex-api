package main

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type CommPolicy struct {
	Price int `json:"price"`
}

func addCommercializationPolicy(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	return shim.Success(nil)
}
