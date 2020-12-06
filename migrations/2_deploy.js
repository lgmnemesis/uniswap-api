const UniConnector = artifacts.require("UniConnector");

module.exports = function (deployer) {
  const uniswapRV2Addess = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  deployer.deploy(UniConnector, uniswapRV2Addess);
};
