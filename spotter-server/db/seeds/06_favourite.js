
const rand = (x) => {
  return Math.floor(Math.random() * x) + 1;
}

const entry = () => ({
  user_id: rand(50),
});

exports.seed = function(knex, Promise) {
  const randNumbers = [];
  for (let i = 0; i < 150; i++) {
    randNumbers.push(entry());
  }
  // Deletes ALL existing entries
  return Promise.all([
    // Reset user ids to start with 1 again
    knex.schema.raw('ALTER SEQUENCE favourite_id_seq RESTART WITH 1'),
    knex('favourite').del()
      .then(function () {
        // Inserts seed entries
        return knex('favourite').insert(randNumbers);
    })
  ])
};
