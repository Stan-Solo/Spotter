
const rand = () => {
  return Math.floor(Math.random() * 10) + 1;
}

const entry = () => ({
  favourite_id: rand(),
  song_id: rand()*4
});

exports.seed = function(knex, Promise) {
  const randNumbers = [];
  for (let i = 0; i < 10; i++) {
    randNumbers.push(entry());
  }
  // Deletes ALL existing entries
  return knex('favourite_song').del()
    .then(function () {
      // Inserts seed entries
      return knex('favourite_song').insert(randNumbers);
  })
};

