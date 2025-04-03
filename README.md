# create-toc-action



git add .
git commit -m 'update'
git push



## Testing

cd "~\Documents\open-readers-bibles\action-testbed"
Add-Content -Path "dummy.txt" -Value "`n# Trivial change"
git add dummy.txt
git commit -m "Made a trivial change to main.yml"
git push


## Testing with act
Make sure docker is running, then:

Start-Process powershell -Verb runAs
cd
cd "~\Documents\open-readers-bibles\action-testbed"

act
act push
act -s who-to-greet="Local Test"