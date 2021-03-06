import React, { useEffect } from 'react'
import Router from 'next/router'

export function useEvent(
  event: string,
  handler: () => void,
  passive = false,
  element?: HTMLElement
) {
  useEffect(() => {
    const elm = element ? element : window
    // initiate the event handler
    elm.addEventListener(event, handler, passive)
    // this will clean up the event every time the component is re-rendered
    return function cleanup() {
      elm.removeEventListener(event, handler, passive)
    }
  })
}

// cookie utilities
export function setCookie(name: string, val: string) {
  const date = new Date()

  // set expiration date to 4 weeks
  date.setTime(date.getTime() + 4 * 7 * 24 * 60 * 60 * 1000)

  // set the cookie
  document.cookie = `${name}=${val};expires=${date.toUTCString()};path=/`
}

export function getCookieFromCookies(cookies: string, name: string) {
  const val = `; ${cookies}`
  const parts = val.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift()
  }
}

export function getCookie(name: string) {
  const val = `; ${document.cookie}`
  const parts = val.split(`; ${name}=`)

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift()
  }
}

export function deleteCookie(name: string) {
  const date = new Date()

  // set expiration date to yesterday
  date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000)

  // the cookie
  document.cookie = `${name}=;expires=${date.toUTCString()};path=/`
}

export function redirectTo(path: string) {
  Router.push(path)
}

export function areLoggedIn() {
  // on first load, window will be undefined. this is what the onLoad/useEvent handler is for.
  // on navigation, window WILL be defined, so the onLoad handler will never fire.
  const [loggedIn, setLoggedIn] = React.useState(
    typeof window !== 'undefined' ? !!getCookie('UserToken') : false
  )
  const onLoad = () => {
    setLoggedIn(!!getCookie('UserToken'))
  }
  useEvent('load', onLoad)
  return loggedIn
}

export function ifLoggedInRedirectTo(path: string) {
  if (areLoggedIn()) {
    redirectTo(path)
  }
}

export function toMixedNumber(num: number) {
  var gcd = function (a: number, b: number): number {
    if (b < 0.0000001) return a // Limit the precision

    return gcd(b, Math.floor(a % b)) // Discard any fractions due to limitations in precision.
  }
  var fraction = num % 1
  var wholeNum = num - fraction
  fraction = parseFloat(fraction.toFixed(2))

  var len = fraction.toString().length - 2

  var denominator = Math.pow(10, len)
  var numerator = fraction * denominator

  var divisor = gcd(numerator, denominator)

  numerator /= divisor
  denominator /= divisor

  // handle where fraction is 33/100 or 3/10
  if (
    (numerator === 33 && denominator === 100) ||
    (numerator === 3 && denominator === 10)
  ) {
    numerator = 1
    denominator = 3
  }

  if (numerator === 0) {
    return wholeNum
  } else if (wholeNum === 0) {
    return numerator.toFixed(0) + '/' + denominator.toFixed(0)
  } else {
    return (
      wholeNum.toFixed(0) +
      ' ' +
      numerator.toFixed(0) +
      '/' +
      denominator.toFixed(0)
    )
  }
}

export const convertFractionToDecimal = (fraction: string) => {
  let evalFraction = fraction.toString().replace(' ', '+')
  let decimal = eval(evalFraction)
  return decimal
}

// For sanitizing form inputs.
// SkipKeys is for if you want to skip those keys, eg a user's bio - should be able to set this to an empty string.
export function removeEmptyFields(data: any, skipKeys?: Array<any>) {
  Object.keys(data).forEach((key) => {
    if (!skipKeys?.includes(key)) {
      if (data[key] === '' || data[key] == null) {
        delete data[key]
      }
    }
  })
}
export function removeFieldsByKey(data: any, deleteKeys: Array<any>) {
  Object.keys(data).forEach((key) => {
    if (deleteKeys.includes(key)) {
      delete data[key]
    }
  })
}

export function blobToFile(theBlob: Blob, fileName: string): File {
  var b: any = theBlob
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date()
  b.name = fileName

  //Cast to a File() type
  return theBlob as File
}

export async function urlToFile(url: string) {
  const imageFile = await fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const file = blobToFile(blob, url)
      return file
    })
  return imageFile
}

// EXPERIMENTAL METHOD
export function ensureVarIsSet(variable: any) {
  return new Promise(function (resolve, reject) {
    ;(function waitForVar() {
      if (variable) {
        return resolve(variable)
      }
      setTimeout(waitForVar, 30)
    })()
  })
}

export function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  let time = {
    hours: hours.toString(),
    minutes: minutes < 10 ? '0' + minutes : minutes + '',
    message:
      hours > 1 ? 'hours' : hours ? 'hour' : minutes > 1 ? 'minutes' : 'minute',
  }

  return time
}
