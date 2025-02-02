const cyrillic = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя'’ʼ"

const mapping = [
  'а', 'a',
  'б', 'b',
  'в', 'v',
  'г', 'ğ',
  'ґ', 'g',
  'д', 'd',
  'е', 'e',
  'ж', 'ž',
  'з', 'z',
  'и', 'y',
  'і', 'i',
  'к', 'k',
  'л', 'l',
  'м', 'm',
  'н', 'n',
  'о', 'o',
  'п', 'p',
  'р', 'r',
  'с', 's',
  'т', 't',
  'у', 'u',
  'ф', 'f',
  'ц', 'c',
  'ч', 'č',
  'ш', 'š',
]

const soft = [
  'з', 'ź',
  'с', 'ś',
  'ц', 'ć',

  'д', 'ď',
  'л', 'ľ',
  'н', 'ň',
  'т', 'ť',
]

const consonants = 'бвгґджзклмнпрстфхцчшщ'
const vowels = 'аеиіу'

const latinConsonants = 'bvğgdžzklmnprstfchšč'

const twoLettered = [
  'х', 'kh',
  'щ', 'šč',
]

const apostrophes = ["'", "’", "ʼ"]

const softVowels = ['є', 'ї', 'ю', 'я']

const hardParts = [
  'є', 'e',
  'ю', 'u',
  'я', 'a',
]

const umlauts = [
  'є', 'ë',
  'ю', 'ü',
  'я', 'ä',
]

function capitalize(string) {

  return string.toUpperCase()

}

function toLatin(data) {

  let res = ''

  let prev = '\n'
  let i = 0
  let ignoreChars = 0
  for (let c of data.cyrillic) {

    if (ignoreChars > 0) {

      prev = c
      i++

      ignoreChars--

      continue

    }

    let lc = c.toLowerCase()

    if (mapping.includes(lc) && mapping.indexOf(lc)%2 == 0) {

      let added = mapping[mapping.indexOf(lc)+1]
      res += (c == lc) ? added : capitalize(added)

    } else if (lc == 'ь') {

      let next = data.cyrillic[i+1] || '\n'
      let ln = next.toLowerCase()
      if (ln == 'о') {

        res += (next == ln) ? 'ö' : 'Ö'
        ignoreChars = 1

      } else {

        res = res.slice(0, -1)

        let lp = prev.toLowerCase()
        if (soft.includes(lp) && soft.indexOf(lp)%2 == 0) {

          let added = soft[soft.indexOf(lp)+1]
          res += (prev == lp) ? added : capitalize(added)

        }

      }

    } else if (lc == 'й') {

      let next = data.cyrillic[i+1] || '\n'
      let ln = next.toLowerCase()
      if (ln == 'о') {

        res += (c == lc) ? 'j' : 'J'

      } else {

        res += (c == lc) ? "j" : "J"

        if (vowels.includes(ln)) {
          res += "'"
        }

      }

    } else if (twoLettered.includes(lc) && twoLettered.indexOf(lc)%2 == 0) {

      let added = twoLettered[twoLettered.indexOf(lc)+1]
      res += (c == lc) ? added[0] : capitalize(added[0])

      let lp = prev.toLowerCase()
      let up = prev.toUpperCase()

      let next = data.cyrillic[i+1] || '\n'
      let ln = next.toLowerCase()
      let un = next.toUpperCase()

      if (c != lc) {

        res += (
            (cyrillic.includes(lp) && prev == up)
            || (cyrillic.includes(ln) && next == un)
          ) ? capitalize(added[1]) : added[1]

      } else {

        res += added[1]

      }

    } else if (softVowels.includes(lc)) {

      let apostrophe = false
      if (apostrophes.includes(prev)) {

        res = res.slice(0, -1)
        apostrophe = true

      }

      if (lc == 'ї') {

        res += (c == lc) ? 'j' : 'J'

        let lp = prev.toLowerCase()
        let up = prev.toUpperCase()

        let next = data.cyrillic[i+1] || '\n'
        let ln = next.toLowerCase()
        let un = next.toUpperCase()

        if (c != lc) {

          res += (
            (cyrillic.includes(lp) && prev == up)
            || (cyrillic.includes(ln) && next == un)
          ) ? 'I' : 'i'

        } else {

          res += 'i'

        }

      } else {

        let lp = prev.toLowerCase()
        if (!consonants.includes(lp)) {

          res += (c == lc) ? 'j' : 'J'

          let added = hardParts[hardParts.indexOf(lc)+1]

          let lp = prev.toLowerCase()
          let up = prev.toUpperCase()

          let next = data.cyrillic[i+1] || '\n'
          let ln = next.toLowerCase()
          let un = next.toUpperCase()

          if (c != lc) {

            res += (
              (cyrillic.includes(lp) && prev == up)
              || (cyrillic.includes(ln) && next == un)
            ) ? capitalize(added) : added

          } else {

            res += added

          }

        } else {

          let added = umlauts[umlauts.indexOf(lc)+1]
          res += (c == lc) ? added : capitalize(added)

        }

      }

    } else {

      res += c

    }

    prev = c
    i++

  }

  data.latin = res

}

function toCyrillic(data) {

  let res = ''

  let prev = '\n'
  let i = 0
  let ignoreChars = 0
  for (let c of data.latin) {

    if (ignoreChars > 0) {

      prev = c
      i++

      ignoreChars--

      continue

    }

    let twoLetters = data.latin.slice(i, i+2) || c
    let ltl = twoLetters.toLowerCase()
    let lc = c.toLowerCase()
    if (twoLettered.includes(ltl) && twoLettered.indexOf(ltl)%2 != 0) {

      let added = twoLettered[twoLettered.indexOf(ltl)-1]
      res += (twoLetters == ltl) ? added : capitalize(added)

      ignoreChars = 1

    } else if (soft.includes(lc) && soft.indexOf(lc)%2 != 0) {

      let added = soft[soft.indexOf(lc)-1]
      res += (c == lc) ? added : capitalize(added)

      let next = data.latin[i+1] || '\n'
      let un = next.toUpperCase()
      if (c != lc) {

        res += (next == un) ? 'Ь' : 'ь'

      } else {

        res += 'ь'

      }

    } else if (lc == 'ö') {

      res += (c == lc) ? 'ьо' : 'ЬО'

    } else if (umlauts.includes(lc) && umlauts.indexOf(lc)%2 != 0) {

      let added = umlauts[umlauts.indexOf(lc)-1]
      res += (c == lc) ? added : capitalize(added)

    } else if (lc == 'j') {

      let next = data.latin[i+1] || '\n'
      let ln = next.toLowerCase()
      if (ln == "'") {

        res += (c == lc) ? 'й' : 'Й'

        ignoreChars = 1

      } else if (ln == 'o') {

        res += (c == lc) ? 'й' : 'Й'

      } else if (ln == 'i') {

        let lp = prev.toLowerCase()
        if (latinConsonants.includes(lp)
              && ((c == lc && next == ln) || (c != lc && next != ln))) {

          res += "'"

        }

        res += (c == lc) ? 'ї' : 'Ї'

        ignoreChars = 1

      } else if (hardParts.includes(ln) && hardParts.indexOf(ln)%2 != 0) {

        let lp = prev.toLowerCase()
        if (latinConsonants.includes(lp)
              && ((c == lc && next == ln) || (c != lc && next != ln))) {

          res += "'"

        }

        let added = hardParts[hardParts.indexOf(ln)-1]
        res += (c == lc) ? added : capitalize(added)

        ignoreChars = 1

      } else {

        res += (c == lc) ? 'й' : 'Й'

      }

    } else if (mapping.includes(lc) && mapping.indexOf(lc)%2 != 0) {

      let added = mapping[mapping.indexOf(lc)-1]
      res += (c == lc) ? added : capitalize(added)

    } else {

      res += c

    }

    prev = c
    i++

  }

  data.cyrillic = res

}

document.addEventListener('alpine:init', () => {
  Alpine.data('data', () => ({
    'cyrillic': '',
    'latin': '',
  }))
})
