import UserAuth from '../component/UserAuth'

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt (min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

function Login ({ loginFunction }) {
  // Quotes taken from this article: https://www.usatoday.com/story/life/2023/11/30/positive-quotes-to-inspire/11359498002/
  const phrases = [
    'It takes courage to grow up and become who you really are.',
    'Keep your face always toward the sunshine, and shadows will fall behind you.',
    'Attitude is a little thing that makes a big difference.',
    'To bring about change, you must not be afraid to take the first step.',
    'All our dreams can come true, if we have the courage to pursue them.',
    "Don't sit down and wait for the opportunities to come.",
    'Champions keep playing until they get it right.',
    'I am lucky that whatever fear I have inside me, my desire to win is always stronger.',
    'You are never too old to set another goal or to dream a new dream.',
    'It is during our darkest moments that we must focus to see the light.',
    "Believe you can and you're halfway there.",
    "Life shrinks or expands in proportion to one's courage.",
    "Try to be a rainbow in someone's cloud.",
    "If you don't like the road you're walking, start paving another one.",
    'Real change, enduring change, happens one step at a time.',
    'It is never too late to be what you might have been.',
    'Give light and people will find the way.',
    "It always seems impossible until it's done.",
    "Don't count the days, make the days count.",
    'If you risk nothing, then you risk everything.',
    'Definitions belong to the definers, not the defined.',
    "When you have a dream, you've got to grab it and never let go.",
    "Never allow a person to tell you no who doesn't have the power to say yes.",
    'When it comes to luck, you make your own.',
    "If you're having fun, that's when the best memories are built.",
    'Failure is the condiment that gives success its flavor.',
    "You define beauty yourself, society doesn't define your beauty.",
    "You just gotta keep going and fighting for everything, and one day you'll get to where you want.",
    'If you prioritize yourself, you are going to save yourself.',
    'A problem is a chance for you to do your best.',
    "When you can't find someone to follow, you have to find a way to lead by example.",
    'There is no better compass than compassion.',
    'Stand before the people you fear and speak your mind even if your voice shakes.',
    'Vitality shows not only in the ability to persist but in the ability to start over.',
    "The most common way people give up their power is by thinking they don't have any.",
    'Love yourself first and everything else falls into line.',
    "In three words I can sum up everything I've learned about life: It goes on."
  ]

  const index = getRandomInt(0, phrases.length)

  return (
    <UserAuth
      title='Login'
      endpoint='login'
      actionString='Login'
      phrase={phrases[index]}
      loginFunction={loginFunction}
    />
  )
}

export default Login
