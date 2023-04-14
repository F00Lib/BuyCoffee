import {ethers} from "hardhat";

async function main(){
    const BuyMeCoffee = await ethers.getContractFactory("BuyMeACoffee");
    const buyMeCoffee = await BuyMeCoffee.deploy();
    await buyMeCoffee.deployed();
    //0xbF5dAe344f753C4514330FAd138103AA2c4F4955
    console.log("BuyMeACoffee deployed at:",buyMeCoffee.address);
}
main()
    .then(()=>process.exit(0))
    .catch((error)=>{
        console.error(error);
        process.exit(1);
    });