pragma solidity ^0.7.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IUniswap {
  function swapExactTokensForETH(
    uint amountIn, 
    uint amountOutMin, 
    address[] calldata path, 
    address to, 
    uint deadline)
        external
        returns (uint[] memory amounts);

  function WETH() external pure returns (address);
}

contract UniConnector {
  IUniswap uniswap;

  constructor(address _uniswap) {
    uniswap = IUniswap(_uniswap);
  }

  function swapTokensForETH(
    address token, 
    uint amountIn,
    uint amountOutMin,
    uint deadline) external {
      IERC20(token).approve(address(this), amountIn);
      IERC20(token).transferFrom(msg.sender, address(this), amountIn);
      address[] memory path = new address[](2);
      path[0] = token;
      path[1] = uniswap.WETH();
      IERC20(token).approve(address(uniswap), amountIn);
      uniswap.swapExactTokensForETH(
        amountIn,
        amountOutMin,
        path,
        msg.sender,
        deadline
      );
  }

}


