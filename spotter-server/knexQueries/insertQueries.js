module.exports = function insertQueries(knex) {
  return {

    addMessage: async function (content, type, userId, chatroomId, id) {
      try{
        await knex('message').insert({id: id, type: type, content: content, user_id: userId, chatroom_id: chatroomId});
      }
      catch(e) {
        console.log('error inserting message into database', e)
      }
    },

    addChatroom: async function (userId, friendId) {
      try{
        let chatroomId = await knex('chatroom').insert({}).returning('id')
        await knex('user_chatroom').insert({chatroom_id: chatroomId[0], user_id: userId})
        await knex('user_chatroom').insert({chatroom_id: chatroomId[0], user_id: friendId})
        return chatroomId[0]
      }
      catch(e) {
        console.log('error inserting chatroom into database', e)
      }
    }

  }
}