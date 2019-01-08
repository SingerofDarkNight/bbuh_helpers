import gotham from 'gotham-encoder';

const encoded = document.getElementById('encoded');
const decoded = document.getElementById('decoded');
const encodeBtn = document.getElementById('encode');
const decodeBtn = document.getElementById('decode');

encodeBtn.addEventListener('click', e => {
    const newEncodedVal = gotham.encode(decoded.value);
    encoded.value = newEncodedVal;
});

decodeBtn.addEventListener('click', e => {
    const newDecodedVal = gotham.decode(encoded.value);
    decoded.value = newDecodedVal;
});
