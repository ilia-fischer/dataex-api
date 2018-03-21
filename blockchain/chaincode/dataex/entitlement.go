package main

import (
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type Entitlement struct {
	ReqAttrs []string `json:"reqattr"`
}

func addEntitlement(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	return shim.Success(nil)
}

func removeEntitlement(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	return shim.Success(nil)
}
