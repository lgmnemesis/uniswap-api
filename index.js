const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const ethers = require('ethers');
require('dotenv').config();

const chainId = ChainId.MAINNET;
const daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';

const trading = async () => {
  const dai = await Fetcher.fetchTokenData(chainId, daiAddress);
  const weth = WETH[chainId];
  const pair = await Fetcher.fetchPairData(dai, weth);
  const route = new Route([pair], weth);
  const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT);

  console.log('Mid price for eth:', route.midPrice.toSignificant(6));
  console.log('Mid price for dai:', route.midPrice.invert().toSignificant(6));
  console.log('Trade price:', trade.executionPrice.toSignificant(6));
  console.log('Next Trade price:', trade.nextMidPrice.toSignificant(6));

  const slippageTolerance = new Percent('50', '10000');
  const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
  const path = [weth.address, dai.address];
  const to = process.env.RECIPIENT_ADDRESS;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
  const value = trade.inputAmount.raw;
  const uniswap = getContract();
  const tx = await uniswap.swapExactETHForTokens(
    amountOutMin,
    path,
    to,
    deadline,
    {value, gasPrice: 50e9}
  );

  console.log('Tx Hash:', tx.hash);
  const receipt = await tx.wait();
  console.log('Tx minted - block number:', receipt.blockNumber);
}

const getContract = () => {
  const provider = ethers.getDefaultProvider('mainnet', {
    infura: process.env.INFURA_URL
  });
  const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY);
  const account = signer.connect(provider);
  return new ethers.Contract(
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    ['function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'],
    account
  );
}

trading();
