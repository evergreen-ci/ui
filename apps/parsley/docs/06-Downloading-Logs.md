# Downloading Logs

There are several ways to download Parsley logs. Downloading logs may be necessary if your task produces particularly large logs, as Parsley is only able to process logs up to a size of 2.5GB.

Note that there is a 1 minute timeout on log downloads. If you find that your downloads are terminating after a minute, it's likely that the log was only partially downloaded.

The methods listed below are ordered from most to least recommended. We recommend going through these methods sequentially if you are running into issues fetching your logs.

## Via Evergreen CLI
You can use the following commands with the `evergreen` client to fetch task and test logs.

#### Task Logs
```properties
evergreen task build TaskLogs --task_id <task_id> --execution <execution> --type <task_log_type>  --o output.txt
```

See other options using the following command:
```properties
evergreen task build TaskLogs --help
```

#### Test Logs
```properties
evergreen task build TestLogs --task_id <task_id> --execution <execution> --log_path <test_log_path> --o output.txt
```
To find the correct value for `<test_log_path>`, look for the lines that say "storing test log file" in the task logs. You can also find this information by looking at the output of `https://evergreen.mongodb.com/rest/v2/tasks/<task_id>/tests` in your browser.

See other options using the following command:
```properties
evergreen task build TestLogs --help
```

## Via Spruce

Right click the "Raw" button and select the "Save Link As..." option. This will save the logs as a `.txt` file.

#### Task Logs
![task logs button](./images/task_logs_button.png)

#### Test Logs
![test logs button](./images/test_logs_button.png)

## Via Terminal

Use your terminal to fetch logs from the Evergreen REST API. Note that special characters in the URL may have to be escaped.

#### Task Logs
```properties
# with cURL
curl -H Api-User:<your_user_id> -H Api-Key:<your_api_key> https://evergreen.mongodb.com/rest/v2/tasks/<task_id>/build/TaskLogs -o output.txt

# with wget
wget --header="Api-User:<your_user_id>" --header="Api-Key:<your_api_key>" https://evergreen.mongodb.com/rest/v2/tasks/<task_id>/build/TaskLogs -O output.txt
```

#### Test Logs
```properties
# with cURL
curl -H Api-User:<your_user_id> -H Api-Key:<your_api_key> https://evergreen.mongodb.com/rest/v2/tasks/<task_id>/build/TestLogs/<test_log_path> -o output.txt

# with wget
wget --header="Api-User:<your_user_id>" --header="Api-Key:<your_api_key>" https://evergreen.mongodb.com/rest/v2/tasks/<task_id>/build/TestLogs/<test_log_path> -O output.txt
```

To find the correct value for `<test_log_path>`, look for the lines that say "storing test log file" in the task logs. You can also find this information by looking at the output of `https://evergreen.mongodb.com/rest/v2/tasks/<task_id>/tests` in your browser. 

## Via a Spawn Host

Spawn a host and try to download the logs using the commands for the terminal (shown in the previous section). 

This method may work even if previous methods fail because file transfers via spawn hosts are typically faster. This means that you may be able grab the entire log before the 1 minute timeout kicks in.

## Ask for Help in a Public Channel

If you are still unable to download the full log, you will need to ask for assistance from the DevProd Infrastructure team so that they can manually fetch it for you.
