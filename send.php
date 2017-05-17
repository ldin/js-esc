<?php

if(!$_POST) {
    echo 'Ошибка';
    exit();
}

require 'vendor/autoload.php';

//$emails = [
//    "alexander.arsenev@qbfin.ru",
//    "andrey.krupnov@qbfin.ru"
//];
$emails = [
    "alena.blokhina@qbfin.ru"
];

$siteName = $_SERVER['SERVER_NAME'];


$form_name = (!empty($_POST["name"]))?htmlspecialchars($_POST["name"]):null;
$form_email = (!empty($_POST["email"]))?htmlspecialchars($_POST["email"]):null;
$form_confidentiality = (!empty($_POST["confidentiality"]))?($_POST["confidentiality"]):null;

$form_contact = htmlspecialchars($_POST['contact']);
$form_link = htmlspecialchars($_POST['link']);
$subject = 'Обратный звонок';
$description = (!empty($_POST["description"]))?$_POST['description']:null;

$json = array();
if ( !$form_contact ) {
    $json['error'] = 'Вы зaпoлнили нe всe пoля!';
    echo json_encode($json);
    die();
}

$message = '<html><body><h2>Заявка на звонок с сайта '.$siteName.'</h2>';
if( $form_name != null){
    $message .= '<p>Имя:<b> '.$form_name.'</b></p>' ;
}
if( $form_email != null){
    $message .= '<p>E-mail:<b> '.$form_email.'</b></p>' ;
}
if( $form_confidentiality != null) {
    $message .= '<p>Я согласен на обработку персональных данных</p>';
}
$message .= '<p>Контакт:<b> '.$form_contact.'</b></p>'.
            '<p>Ссылка:<b> '.$form_link.'</b></p>';
if( $description != null) {
    $message .= '<p style="color:#ccc">___________________</p><p>Доп. информация</p>' . $description ;
}
$message .= '</body> </html>';


$mail = new \Nette\Mail\Message();
$mail->setFrom('landing@qbfin.ru', $siteName);
foreach($emails as $email) {
    $mail->addTo($email);
}
$mail->setSubject($siteName.': '.$subject);
$mail->setHTMLBody($message);

//require_once __DIR__ . "/module.php"; //include logic
//Megatask::send([
//    "Phone" => $_POST["contact"],
//    "FirstName" => $_POST["name"],
//    "Comment" => strip_tags($message),
//    "OrderType" => $subject,
//    "StaticFields" => [
//        "Model" => [
//            "AdvertisingWay" => 1,
//        ]
//    ],
//]);

$mailer = new \Nette\Mail\SmtpMailer([
    'host' => 'mail.qbfin.ru',
    'port' => 25,
    'username' => 'landing@qbfin.ru',
    'password' => '9S3waB',
    'secure' => 'tls',
]);

$mailer->send($mail);

echo "success";

?>
