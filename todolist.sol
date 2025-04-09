// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract ToDo {
    string[] list;

    function AddTusk(string memory tusk) public{
        list.push(tusk);
    }
    function Remove(uint index) public {
        for (uint i = index;i<list.length-1;i++){
            list[i]=list[i+1];
            list.pop();
        }
    }
    function Show() view public returns(string[] memory){
        return list;
    }
}