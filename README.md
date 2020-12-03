> Designed to keep generating Ethereum vanity addresses forever.

Runs as a single threaded background process .. checks for:<br>
any 8x consecutive digits `0x11111111` `/([a-fA-F0-9])\1/gi` .. check for unique digits 1 or 8<br>
any 4x repeating digits `0x69696969` `/^.*[0-9]{2,}.*?$/gim`<br>
any 8x incremental digits `0x23456789` `0xabcdefgh`<br>
any 4x consecutive digits `0x5555abcd`<br>
any 2 digits `0x56555655`<br>
starts with: `0xbada55` `0xbadA55` or `0xBADA55`<br>
    
You can experiment with the regexp's here https://regex101.com/r/iE2xM4/2<br>
Secret Sauce: `^([a-fA-F0-9]{2})\1{3,}/g`<br>

Test notes
```
TODO: first 8 all numbers 0x12345678
TODO: first 8 all letters 0xabcdefgh
/^[0-9a-fA-F]{8,}/gm
^\d{8,}|^[a-f]{8,}|^[A-F]{8,}
/^\d{8,}|^(.)\1{8,}/gm
8x Any character: /^(.)\1{7,}/g 
