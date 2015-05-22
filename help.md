###################################################################
# Usage: repovault [PASSWORD] [CONTENT] [[-D || -d || --delete]]  #
###################################################################

Example:

To store data:
repovault mypassword "The password of money vault is: 42"

To store from file:
repovault mysshkey $(cat ~/.ssh/id_rsa.pub)

To recover data:
repovault mypassword

To delete data:
repovault mypassword --delete
