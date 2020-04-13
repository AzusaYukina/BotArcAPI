// filename : arcapi/_arcapi_friend_clear.js
// author   : CirnoBakaBOT
// date     : 04/11/2020
// comment  : delete all friends from an arc account

const TAG = 'arcapi/_arcapi_friend_clear.js';

const arcapi_userme = require('./_arcapi_userme');
const arcapi_friend_delete = require('./_arcapi_friend_delete');

module.exports = async (account, friends = []) => {

  // we must request the origin arcapi
  // if no friend list passed in
  if (!friends.length) {
    const _return = await arcapi_userme(account);

    // check data is valid
    if (_return.success)
      friends = _return.info.friends;
    else {
      syslog.e(TAG, `Error when fetching account information => ${account.name}`);
      return false;
    }
  }

  // delete all friends
  if (friends.length) {
    try {
      for (let i = 0; i < friends.length; ++i) {
        syslog.v(TAG, `Deleting friend => ${friends[i].name} ${friends[i].user_id}`);

        const _return = await arcapi_friend_delete(account, friends[i].user_id);
        if (!_return.success) {
          syslog.e(TAG, `Error when deleting friend => ${friends[i].name}`);
          throw new Error('wtf???');
        }
      }

    } catch (e) {
      syslog.e(TAG, `Error when clearing friend list => ${account.name}`);
      return false;
    }
  }

  // clear origin friendlist and return
  friends = [];
  return true;
};
