/********************************************************
 * @function    : integerToWords()
 * @purpose     : Converts Unsigned Integers to Words
 *                Using String Triplet Array.
 * @version     : 1.05
 * @author      : Mohsen Alyafei
 * @date        : 15 January 2021
 * @param       : {number} [integer numeric or string]
 * @returns     : {string} The wordified number string
 ********************************************************/

const Ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ],
  Tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
    'Hundred',
  ],
  Scale = [
    '',
    'Thousand',
    'Million',
    'Billion',
    'Trillion',
    'Quadrillion',
    'Quintillion',
    'Sextillion',
  ]

export function numToWords(n = 0) {
  if (n == 0) return 'Zero' // check for zero
  n = ('0'.repeat((2 * (n += '').length) % 3) + n).match(/.{3}/g) // create triplets array
  if (n.length > Scale.length) return 'Too Large' // check if larger than scale array
  let out = ''
  return (
    n.forEach((Triplet, pos) => {
      // loop into array for each triplet
      if (+Triplet) {
        out +=
          ' ' +
          (+Triplet[0] ? Ones[+Triplet[0]] + ' ' + Tens[10] : '') +
          ' ' +
          (+Triplet.substr(1) < 20
            ? Ones[+Triplet.substr(1)]
            : Tens[+Triplet[1]] + (+Triplet[2] ? '-' : '') + Ones[+Triplet[2]]) +
          ' ' +
          Scale[n.length - pos - 1]
      }
    }),
    out.replace(/\s+/g, ' ').trim()
  )
}
