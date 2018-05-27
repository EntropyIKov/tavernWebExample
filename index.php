<?php 
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Access-Control-Allow-Origin: *');
$domain = '';
if(isset($_POST['sender_name']) && !empty($_POST['sender_name']))
{
	$_SESSION['sender_name'] = $_POST['sender_name'];
	$senderName = $_SESSION['sender_name'];
} else {
	$senderName = 'exampleUser';
}
if(isset($_POST['domain']) && !empty($_POST['domain']))
{
	$_SESSION['domain'] = $_POST['domain'];
	$domain = $_SESSION['domain'];
} else {
	$domain = 'root_domain';
}
if(isset($_POST['action']) && $_POST['action'] == 'exit') 
{
	$_SESSION['sender_name'] = '';
	$_SESSION['domain'] = '';
	unset($_SESSION['sender_name']);
	unset($_SESSION['domain']);
}

$key = [
	'root_domain' => 'da978e5a0f772c0d9b4cfd12c359e070', 
	'Brave New World' => '8515832778c509fe1dba03476c2a40c1',
	'Leha chat' => 'ff7f416eeeb7f13dae22400db5c3a154'
	];
$masterLogin = 'root_master';
$signature = signatureGen($masterLogin, $domain, $key[$domain]);
function signatureGen($master, $domain, $key)
{
	return md5($domain.$master.$key);
}

?>

<script src='jquery-3.3.1.min.js'></script>
<link rel="stylesheet" href='web-example.css'>

<?php if(isset($_SESSION['sender_name']) && isset($_SESSION['domain'])):?>
<script src='tavern.js'></script>
<script src='web-example.js'></script>

<div class="tavern-chat" sender-name="<?=$senderName?>" signature="<?=$signature?>" domain="<?=$domain?>" master="<?=$masterLogin?>">
	<ul class="tavern-chat__content">
		<button class='tavern-chat_button-load-old-content'>Load more</button>
	</ul>
	<div class="tavern-chat__control-panel">
		<div class="tavern-chat__control-panel-content-wrapper">
			<textarea class="tavern-chat__message-input" placeholder="Type message..."></textarea>
			<button class="tavern-chat__button tavern-chat__button-send">SEND</button>
			<button class="tavern-chat__button tavern-chat__button-exit">EXIT</button>
		</div>
	</div>
</div>
<?php else: ?>
<form class="name-request" action="index.php" method="POST">
	<label for="sender_name">Enter your name:</label>
	<input type="text" class="name-request__input-name" name="sender_name">
	<input type="submit" class="name-request__submit-button">
	<label for="domain">Choice room:</label>
	<select name="domain" required>
		<option>root_domain</option>
  		<option>Brave New World</option>
  		<option>Leha chat</option>
	</select>
</form>

<?php endif ?>