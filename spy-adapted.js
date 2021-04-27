// Adapted from: 
// Programming Quantum Computers
//   by Eric Johnston, Nic Harrigan and Mercedes Gimeno-Segovia
//   O'Reilly Media
// To run this online, go to http://oreilly-qc.github.io?p=2-4

qc.reset(3);
qc.discard();

var alf = qint.new(1, 'alf');
var line = qint.new(1, 'line');
var cat = qint.new(1, 'cat');

function getRandomBit(qubit) {
    qubit.write(0);
    qubit.had();
    return qubit.read();
}

function dump() {
    qc.print(`[original: ${originalValue}...${receivedValue}], [received: ${receivedHad}...${originalHad}] `)
}
// Generate two random bits
qc.label('2 random bits');
var originalHad = getRandomBit(alf);
var originalValue = getRandomBit(alf);

// Prepare alf qubit
alf.write(0);
qc.label('set value');
if (originalValue)
    alf.not();

qc.label('apply had?');
if (originalHad)
    alf.had();


// Send the qubit!
line.exchange(alf);

// Activate the spy
var isSpyPresent = true;
if (isSpyPresent) {
    var spy_had = 1;
    qc.label('spy');
    if (spy_had)
        line.had();
    stolen_data = line.read();
    line.write(0);
    if (stolen_data)
        line.not();
    if (spy_had)
        line.had();
}

// Receive the qubit!
var receivedHad = getRandomBit(cat);
line.exchange(cat);
qc.label('apply had');
if (receivedHad)
    cat.had();
qc.label('read value');
receivedValue = cat.read();

// Now Alice emails Bob to tell
// him her had setting and value.
// If the had setting matches and the
// value does not, there's a spy!
dump();
if (originalHad == receivedHad) {
    if (originalValue != receivedValue) {
        qc.print('Spy detected! \n');
    }
    else {
        qc.print('Spy not detected\n');
    }
} else {
    qc.print('Unexpected mismatch\n');
}
