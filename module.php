<?php
class Megatask{

    const MT_KEY = "JZNSPhX2NJLS-NzdflLpnQ09oAqe_TgLXF3uEBwItVodDliJ_UzfSPFePmeL";
    const MT_LINK = 'http://acceptor.mgtsk.ru/lead-catcher/catch';

    public static function send($data){
        
        $data = self::sanitaize($data);

        if(!$data["Phone"] && !$data["Email"]) {
            return false;
        }

        $data["utms"] = array(
            "utm_medium" => "",
            "utm_campaign" => "",
            "utm_content" => "",
            "utm_term" => "",
            "utm_source" => ""
        );
        $data["Site"] = $_SERVER['HTTP_HOST'];
        $utm_keys = array();
        $prefix = "mt_";

        foreach (array_keys($data["utms"]) as $utm_key){
            $utm_keys[$prefix.$utm_key] = $utm_key;
        }

        $cookie =  self::sanitaize($_COOKIE);

        foreach ($cookie as $utm_key => $value) {
            if(isset($utm_keys[$utm_key])) {
                $data["utms"][$utm_keys[$utm_key]] = $value;
            }
        }
        $request = array(
            "key" => self::MT_KEY,
            "data"=>$data
        );
        $ch = curl_init(self::MT_LINK);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($request));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        curl_close($ch);
        return array($request, json_decode($result));
    }

    public static function parseGoogleAnalyticsCookies() {
        $returnMap = array();

        $cookieVal = $_COOKIE["__utmz"];
        //now split cookie value by |
        $arrPairs = explode('|', $cookieVal);
        foreach ($arrPairs as $pair) {
            $pair = explode('=', $pair);
            if (sizeof($pair) == 2) {
                $key = $pair[0]; //look for "."
                if (strpos($key, ".")) {
                    $key = substr($key, strrpos($key, ".") + 1);
                }
                $returnMap[$key] = $pair[1];
            }
        }
        return $returnMap;
    }

    public static function sanitaize($inputData) {
        $outputData = array();
        foreach ($inputData as $key => $val) {
            if (is_array($val)) {
                $outputData[$key] = self::sanitaize($val);
            } else {
                $outputData[$key] = htmlspecialchars(trim($val));
            }
        }
        return $outputData;
    }
}
