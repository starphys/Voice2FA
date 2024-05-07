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
    "In three words I can sum up everything I've learned about life: It goes on.",
    "Beneath the veil of darkness, where shadows dance and dreams take flight, lies a realm of infinite possibilities, where the boundaries of reality blur and imagination knows no bounds.",
    "In the depths of the ancient forest, where time stands still and nature reigns supreme, the melody of the woodland creatures fills the air, weaving a tapestry of harmony and balance.",
    "Amidst the bustling city streets, where the rhythm of life pulses with relentless energy, amidst the cacophony of sounds and sights, lies a sanctuary of peace, hidden in the whispers of the wind.",
    "As the sun sets beyond the horizon, casting its warm glow upon the earth, a sense of tranquility washes over the landscape, embracing every living being in its gentle embrace.",
    "In the vast expanse of the cosmos, countless stars twinkle in the eternal dance of creation, painting the night sky with their shimmering light, a silent symphony of cosmic beauty.",
    "In the heart of the wilderness, where the call of the wild echoes through the trees and the rivers run wild and free, we discover the true essence of life, where every breath is a reminder of our connection to the earth and to each other.",
    "Amidst the chaos of modern life, where the rush of traffic and the chatter of crowds drown out the melody of nature, there exists a quiet oasis of peace and tranquility, where the soul finds solace in the embrace of silence and the beauty of simplicity.",
    "Through the corridors of time, where echoes of the past reverberate with the laughter of children and the footsteps of those who came before us, we journey forth into the unknown, guided by the light of our dreams and the warmth of our hearts.",
    "As the sun sets behind the mountains, painting the sky with hues of pink and gold, and as the moon rises to cast its silvery glow upon the land, we find ourselves on the threshold of a new beginning, where dreams take flight and hope springs eternal.",
    "In a world where time seems to stand still, where the whispers of the wind carry the secrets of ancient civilizations, and where the stars above tell tales of love and loss, there lies a realm of infinite possibilities waiting to be explored.",
    "Creativity comes from deep thought, it comes from voraciously reading long books that require focused attention, it comes from meaningful discourse with other intellectually curious people, it comes from listening and asking good questions.",
    "The purity of his judicial character, the faithfulness of his public service in subsequent capacities; his devotedness to his party, and the rigid consistency with which he had adhered to its principles, kept pace with its organized movements.",
    "Oh, to dwell in a city which, much as you grumble at it, is after all very fairly a modern city; with crowds and shops and theaters and cafes and balls and receptions and dinner-parties, and all the modern confusion of social pleasures and pains.",
    "That night he dreamt of horses on a high plain where the spring rains had brought up the grass and the wildflowers out of the ground and the flowers ran all blue and yellow far as the eye could see.",
    "No doubt this astonishment is to some extent due to the fact that the other person on such occasions presents some new facet; but so great is the multiformity of each individual, so abundant the wealth of lines of face and body.",
    "The houses over to Central Park West went first, they got darker as if dissolving into the dark sky until I couldn’t make them out, and then the trees began to lose their shape, and finally, all I could see were these phantom shapes of the white ice.",
    "The streets are paved now, and the telephone and electric companies are cutting down more and more of the shade trees–the water oaks, the maples and locusts and elms–to make room for iron poles.",
    "In the loveliest town of all, where the houses were white and high and the elms trees were green and higher than the houses, where the front yards were wide and pleasant and the back yards were bushy and worth finding out about, they stopped to get a drink.",
    "The French are certainly misunderstood: — but whether the fault is theirs, in not sufficiently explaining themselves, or speaking with that exact limitation and precision which one would expect on a point of importance — I shall not decide.",
    "It is a light blue moonless summer evening, but late, perhaps ten o’clock, with Venus burning hard in daylight, so we are certainly somewhere far north, and standing on this balcony, when from beyond along the coast comes the gathering thunder."
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
