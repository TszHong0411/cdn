function doWork() {
    if (parseInt(navigator.appVersion) <= 3) { //檢查兼容的瀏覽器版本
        alert("抱歉，瀏覽器的版本太舊了！")
        return true;
    }


    document.getElementById("passForm").listOTP.value = "";
    

    //檢查一次密碼
    if (document.getElementById('passForm').chkOTP.checked) {
        document.getElementById('passForm').passField.value = "";
        var i = 0;
        for (i = 1; i < 21; i++) {
            document.getElementById('passForm').listOTP.value += i + "\t: " + GeneratePassword() + "\n";
        }
        document.getElementById('passForm').listOTP.focus();
        document.getElementById('passForm').listOTP.select();
    }
    //生成普通密碼（不是一次性密碼）
    else {
        var Password = GeneratePassword();
        document.getElementById('passForm').passField.value = Password
        document.getElementById('passForm').passField.focus();
        document.getElementById('passForm').passField.select();
    }

    return true;
}

function GeneratePassword()
{
	//設定變數
    var length= (document.getElementById('passForm').selLength.value);
    var sPassword = "";

	//產生密碼
	var i = 0;
    for (i=0; i < length; i++) {
        numI = getRandomNum();
				if (noSpecial) {
					while (checkSpecial(numI)) {
						numI = getRandomNum();
					}
				}
        sPassword = sPassword + String.fromCharCode(numI);
    }

		return sPassword;
}

function getRandomNum()
{
    // between 0 - 1
    var rndNum = Math.random()

    // rndNum from 0 - 1000    
    rndNum = parseInt(rndNum * 1000);

    // rndNum from 33 - 127        
    rndNum = (rndNum % 94) + 33;
            
    return rndNum;
}


function checkSpecial(num) {
    if ((num >=33) && (num <=47)) { return true; }
    if ((num >=58) && (num <=64)) { return true; }    
    if ((num >=91) && (num <=96)) { return true; }
    if ((num >=123) && (num <=126)) { return true; }
    
    return false;
}


//打印OTP列表 
function printOTP() {
	 var s = document.getElementById('passForm').listOTP.value;

	 //將所有字符轉換為HTML實體
	 var escaped="";
	 var c="";
	 for(var i=0; i<s.length;i++)
	 {
			c = s.charAt(i);
			if (c == '\n') {
				 escaped += "<br />\n";
			} else {
				 c = c.charCodeAt(0);
				 //c = 'x'+ c.toString(16);
				 c = '&#'+ c + ';'
				 escaped += c;
			}
	 }

   pWin = window.open('','pWin');
   pWin.document.open();
   pWin.document.write("<html><head><title>一次性密碼列表</title></head><style>body { font-family: courier}</style><body>");
   pWin.document.write(escaped);
   pWin.document.write("</body></html>");
   pWin.print();
   pWin.document.close();
   pWin.close(); 
	 return true;
}