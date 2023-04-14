
import { ethers } from "hardhat";


//return balance
async function getBalance(address){
  const balanceBigInt = await ethers.provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
}

//log the balance of a list of address
async function printBalances(addrs){
  let id =0;
  for( const addr of addrs){
    console.log(`Address ${id}balance:`,await ethers.provider.getBalance(addr));
    id++;
  }
}

async function printMemos(memos){
  for(const memo of memos){
    const time = memo.timestamp;
    const tipper = memo.name;
    const tipperAddr = memo.from;
    const message = memo.message;
    console.log(`At${time},${tipper}(${tipperAddr}) said:${message}`);
  }
}


async function main(){
  const [owner, tipper1,tipper2] = await ethers.getSigners();
  //get the contract
  const BuyMeCoffee = await ethers.getContractFactory("BuyMeACoffee");
  const buymecoffee = await BuyMeCoffee.deploy();
  //deploy the contract
  await buymecoffee.deployed();
  console.log("Buymecoffee deployed at:",buymecoffee.address);
  //check the balance
  const tippers = [owner.address,tipper1.address,tipper2.address];
  console.log("==start==");
  await printBalances(tippers);

  //buy
  const tip = {value:ethers.utils.parseEther("1")};
  await buymecoffee.connect(tipper1).buyCoffee("Carolina","you're the best",tip);
  await buymecoffee.connect(tipper2).buyCoffee("Vitto","Amazing",tip);
  //check
  console.log("==bought coffee==");
  await printBalances(tippers);
  //withdraw
  await buymecoffee.connect(owner).withdrawTips();
  //check balances after withdraw
  console.log("==withdrawTips==");
  await printBalances(tippers);
  //check the memos
  console.log("==memos==");
  const memos = await buymecoffee.getMemos();
  await printMemos(memos);
}
main()
  .then(()=>process.exit(0))
  .catch((error)=>{
    console.error(error);
    process.exit(1);
  });