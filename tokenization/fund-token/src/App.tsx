import { useState, useEffect } from "react";
import { Contract, ethers } from "ethers";
import FundToken from "./artifacts/contracts/FundToken.sol/FundToken.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import "./App.css";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";

const contractAddress = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";

function App() {
  const [provider, setProvider] = useState<Web3Provider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [balance, setBalance] = useState<number | null>(0);
  const [totalSupply, setTotalSupply] = useState<number | null>(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [transferAddress, setTransferAddress] = useState("");

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        console.error("window.ethereum is not defined");
        return;
      }

      console.log(window.ethereum);
      await window.ethereum?.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const signer = provider.getSigner();
      console.log(provider);
      console.log(signer);
      const contract = new ethers.Contract(
        contractAddress,
        FundToken.abi,
        signer
      );
      console.log(contract);
      setProvider(provider);
      setSigner(signer);
      setContract(contract);
      const balance = await contract.balanceOf(await signer.getAddress());
      console.log(balance);
      setBalance(balance.toString());
      const totalSupply = await contract.totalSupply();
      setTotalSupply(totalSupply / 1e18);
    };
    init();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const [balance, totalSupply] = await Promise.all([
        getBalance(),
        getTotalSupply(),
      ]);
      setBalance(balance);
      setTotalSupply(totalSupply);
      setMessage("Data refreshed successfully");
    } catch (error) {
      setMessage("Error refreshing data");
    }
    setLoading(false);
  };

  const getBalance = async () => {
    const balance = await contract?.balanceOf(await signer?.getAddress());
    return balance?.toString();
  };

  const getTotalSupply = async () => {
    const totalSupply = await contract?.totalSupply();
    return (totalSupply / 1e18).toString();
  };

  const transferTokens = async () => {
    await contract?.transfer(recipient, amount);
    alert("Transfer successful");
    setMessage("Transfer successful");
    setRecipient("");
    setAmount("");
    getBalance();
  };

  const buyTokens = async () => {
    const value = ethers.utils.parseEther(
      (Number(buyAmount) * 0.00001).toString()
    );
    await contract?.buyTokens({ value });
    alert("Purchase successful");
    setMessage("Purchase successful");
    setBuyAmount("");
    await handleRefresh();
  };

  const sellTokens = async () => {
    await contract?.sellTokens(sellAmount);
    alert("Sale successful");
    setMessage("Sale successful");
    setSellAmount("");
    await handleRefresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6 p-4">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Fund Tokenization App</CardTitle>
            <CardDescription>Manage your tokens with ease</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Token Info</h3>
                  <Button onClick={handleRefresh} disabled={loading} size="sm">
                    Refresh
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Your Balance</p>
                    <p className="text-xl font-bold">
                      {balance !== null ? balance : "Loading..."}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Supply</p>
                    <p className="text-xl font-bold">
                      {totalSupply !== null ? totalSupply : "Loading..."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transferAddress">Transfer Tokens</Label>
                <Input
                  id="transferAddress"
                  placeholder="Recipient Address"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                <Input
                  id="transferAmount"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button
                  onClick={transferTokens}
                  disabled={loading}
                  className="w-full"
                >
                  Transfer
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyAmount">Buy Tokens</Label>
                <Input
                  id="buyAmount"
                  placeholder="Amount"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                />
                <Button
                  onClick={buyTokens}
                  disabled={loading}
                  className="w-full"
                >
                  Buy
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellAmount">Sell Tokens</Label>
                <Input
                  id="sellAmount"
                  placeholder="Amount"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                />
                <Button
                  onClick={sellTokens}
                  disabled={loading}
                  className="w-full"
                >
                  Sell
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {message && (
              <p className="text-sm font-medium text-center w-full">
                {message}
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default App;
