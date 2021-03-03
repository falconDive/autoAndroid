#!/bin/bash

if [ $# -lt 6 ]; then
  echo 1>&2 "$0: not enough arguments"
  exit 2
elif [ $# -gt 6 ]; then
  echo 1>&2 "$0: too many arguments"
  exit 2
fi

echo "Passed 1st parameter $1"
echo "Passed 2nd parameter $2"
echo "Passed 3rd parameter $3"
echo "Passed 4th parameter $4"
echo "Passed 5th parameter $5"
echo "Passed 5th parameter $6"
WORKING_DIRECTORY=../HelloWorld
APK_DIRECTORY=../autoAPKserver/resources/static/assets/downloads/
JAVA_EXECUTE=/opt/jdk1.8.0_40/bin/javac
IMAGE_PATH=../autoAPKserver/resources/static/assets/uploads/

cd $WORKING_DIRECTORY

[ ! -f database.db ]
 status=$?
 sleep 2

  	if (exit $status)
		then
		echo Database not found, making tables
	   	sqlite3 database.db "CREATE TABLE IF NOT EXISTS DB_GENERATOR(ALRANDOM);"
  	else
		echo Database found, checking if it belongs to me
 	fi

        totalpackages=$(cat /dev/urandom | tr -dc '3-5' | fold -w 256 | head -n 1 | head --bytes 1)
        packagecounter=0
        packagename=""
        sleep 5
	while [ $packagecounter -lt $totalpackages ]
	do       
	  	flag=true;
	  	while $flag; do
			item=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 5 | head -n 1)
			evaluate=`if [[ $item =~ ^[0-9] ]]; then echo 1; else echo 0; fi`
			while [ $evaluate -eq 1 ]
			 do
			   item=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 5 | head -n 1)
			   evaluate=`if [[ $item =~ ^[0-9] ]]; then echo 1; else echo 0; fi`
			done
			NEW_UUID=$item	
			result=`sqlite3 database.db "SELECT EXISTS(SELECT 1 FROM DB_GENERATOR WHERE ALRANDOM = '$NEW_UUID');" `

			if [ $result -eq 1 ]
			    then
				echo "$result is equal to $NEW_UUID"
			else
				echo "$result is not equal to $NEW_UUID"
				sqlite3 database.db "INSERT INTO DB_GENERATOR VALUES ('$NEW_UUID');"
				flag=false
			fi
		done

	  if [ $packagecounter -eq 0 ]
	  then
		packagename="$NEW_UUID"
	  else
	  	packagename="$NEW_UUID/$packagename"
	  fi
	  packagecounter=$(( $packagecounter + 1 ))	
	  packagetodelete="$NEW_UUID"
	  sleep 2
	done 	
echo "done"
mkdir -p "src/$packagename"
echo "Created package src/$packagename"
echo "Package to Delete src/$packagetodelete"
cp dummyvalues.xml res/values/strings.xml
echo $packagename
find ./res -type f -name 'ic_launcher.*' | while read -r icon; do size=`convert "$icon" -print '%wx%h!' /dev/null`; cp $IMAGE_PATH$6 "$icon" && convert "$icon" -resize "$size" "$icon"; done
javapackage=`echo $packagename | tr / .`
echo "package $javapackage;public class Dummy {}" > Dummy.java
cp Dummy.java src/$packagename
sed -i 's#<string name="string1"></string>#<string name="string1">'$1'</string>#' res/values/strings.xml
sed -i 's#<string name="string2"></string>#<string name="string2">'$2'</string>#' res/values/strings.xml
sed -i 's#<string name="string3"></string>#<string name="string3">'$3'</string>#' res/values/strings.xml
sed -i 's#<string name="string4"></string>#<string name="string4">'$4'</string>#' res/values/strings.xml
sed -i 's#<string name="string5"></string>#<string name="string5">'$5'</string>#' res/values/strings.xml

set -e

AAPT="/opt/Android/Sdk/build-tools/26.0.2/aapt"
DX="/opt/Android/Sdk/build-tools/26.0.2/dx"
ZIPALIGN="/opt/Android/Sdk/build-tools/26.0.2/zipalign"
APKSIGNER="/opt/Android/Sdk/build-tools/26.0.2/apksigner" 
PLATFORM="/opt/Android/Sdk/platforms/android-23/android.jar"
echo "Cleaning..."
rm -rf obj/*
rm -rf src/com/test/R.java

echo "Generating R.java file..."
$AAPT package -f -m -J src -M AndroidManifest.xml -S  res -I $PLATFORM

echo "Compiling..."
#javac -d obj -classpath src -bootclasspath $PLATFORM src/com/test/*.java
find -L src/ -name "*.java" > sources.txt
$JAVA_EXECUTE -d obj -classpath src -bootclasspath $PLATFORM  @sources.txt

echo "Translating in Dalvik bytecode..."
$DX --dex --output=classes.dex obj

echo "Making APK..."
$AAPT package -f -m -F bin/hello.unaligned.apk -M AndroidManifest.xml -S res -I $PLATFORM
$AAPT add bin/hello.unaligned.apk classes.dex

echo "Aligning and signing APK..."
$APKSIGNER sign --ks signapp.keystore --ks-key-alias vdr --ks-pass pass:vderive123 bin/hello.unaligned.apk
$ZIPALIGN -f 4 bin/hello.unaligned.apk bin/hello.apk

echo "Deleting: "$packagetodelete
rm -fr mkdir "src/$packagetodelete"
sed -i 's#<string name="string1">'$1'</string>#<string name="string1"></string>#' res/values/strings.xml
sed -i 's#<string name="string2">'$2'</string>#<string name="string2"></string>#' res/values/strings.xml
sed -i 's#<string name="string3">'$3'</string>#<string name="string3"></string>#' res/values/strings.xml
sed -i 's#<string name="string4">'$4'</string>#<string name="string4"></string>#' res/values/strings.xml
sed -i 's#<string name="string5">'$5'</string>#<string name="string5"></string>#' res/values/strings.xml

echo "Completed Successfully"
FILE=helloworld.apk
NAME=${FILE%.*}
EXT=${FILE#*.}
DATE=`date +%d-%m-%y`
VERSION=`awk '$0++' counter > newcounter && mv newcounter counter && cat counter`
echo $VERSION
NEWFILE=${NAME}_${VERSION}_${DATE}.${EXT}
echo $NEWFILE

rm -f $APK_DIRECTORY/*.apk
cp bin/hello.apk $APK_DIRECTORY/$NEWFILE

exit 0
