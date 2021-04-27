// Adapted from: 
// Programming Quantum Computers
//   by Eric Johnston, Nic Harrigan and Mercedes Gimeno-Segovia
//   O'Reilly Media
// To run this onlinQ, go to http://oreilly-qc.github.io?p=2-4

qc.reset(3);
qc.discard();

var gibQ = qint.new(1, 'gibQ');
var linQ = qint.new(1, 'linQ');
var bexQ = qint.new(1, 'bexQ');

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
var originalHad = getRandomBit(gibQ);
var originalValue = getRandomBit(gibQ);

// Prepare gibQ qubit
gibQ.write(0);
qc.label('set value');
if (originalValue)
    gibQ.not();

qc.label('apply had?');
if (originalHad)
    gibQ.had();


// Send the qubit!
linQ.exchange(gibQ);

// Activate the spy
var isSpyPresent = true;
if (isSpyPresent) {
    var spy_had = 1;
    qc.label('spy');
    if (spy_had)
        linQ.had();
    stolen_data = linQ.read();
    linQ.write(0);
    if (stolen_data)
        linQ.not();
    if (spy_had)
        linQ.had();
}

// Receive the qubit!
var receivedHad = getRandomBit(bexQ);
linQ.exchange(bexQ);
qc.label('apply had');
if (receivedHad)
    bexQ.had();
qc.label('read value');
receivedValue = bexQ.read();

// Gib supplies Bex with original Had and Value
// If the had setting matches and the value does not, there's a spy!
dump();
if (originalHad == receivedHad) {
    if (originalValue != receivedValue) {
        qc.print('Spy detected! \n');
    }
    else {
        qc.print('Spy not detected\n');
    }
} else {
    qc.print('Unclear\n');
}
