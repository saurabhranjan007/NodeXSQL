const db = require('../utils/db.config')

// LOGIN
const loginController = async (req, res) => {
    console.log(`inside login controller`);
  
    const { username, password } = req.body;
    console.log(`user: ${username}, pas: ${password}`);
  
    try {
      console.log(`getting user data for: ${username}, type: ${typeof username}`);
  
      const userData = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
          if (err) {
            console.error(`error in fetching user data: ${err}`);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
  
      console.log(`user data:`, userData);
  
      let userExists = false;
      let foundUsername = '';
  
      userData?.length > 0 && userData.forEach((data) => {
        console.log(`data: ${data.username.toLowerCase()}`);
        if (
          data.username.toLowerCase() === username.toLowerCase() &&
          data.password.toLowerCase() === password.toLowerCase()
        ) {
          console.log(`user exists: ${data.username}`);
          userExists = true;
          foundUsername = username.toLowerCase();
        }
      });

      if (userExists) {
        return res.status(200).json({
          message: 'user exists',
          user_name: foundUsername,
        });
      } else {
        return res.status(400).json({
          message: 'user does not exist',
        });
      }
    } catch (err) {
      console.error(`error logging in: ${err}`);
      return res.status(500).json({
        message: 'error occurred',
        error: err,
      });
    }
  };

// RESET
const resetController = async (req, res) => {
  console.log(`inside reset controller`);

  const { username, new_password } = req.body;
  console.log(`
        user: ${username}, 
        new_pass: ${new_password}
    `);

  try {
    console.log(`getting user data for: ${username}, type: ${typeof username}`);

    const userData = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
          console.error(`error in fetching user data: ${err}`);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    console.log(`user data:`, userData);

    let userExists = false;
    let foundUsername = '';

    userData?.length > 0 && userData.forEach((data) => {
      if (data.username && data.username.toLowerCase() === username.toLowerCase()) {
        console.log(`user exists: ${data.username}`);
        userExists = true;
        foundUsername = username.toLowerCase();

        // resetting
        const reset_data = new Promise((resolve, reject) => {
          db.query('UPDATE users SET password=? WHERE username=?', [new_password, username], (err, result) => {
            if (err) {
              console.error(`error in fetching user data: ${err}`);
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
        console.log(`reset res: ${reset_data}`);
      }
    });
    if (userExists) {
      return res.status(200).json({
        message: 'user exists',
        data: `password reset for ${foundUsername}`,
      });
    } else {
      return res.status(400).json({
        message: 'user does not exist',
      });
    }
  } catch (err) {
    console.error(`error resetting pass: ${err}`);
    return res.status(500).json({
      message: 'error occurred',
      error: err,
    });
  }
};



const testUserController = async(req, res) => {

  console.log(`inside test controller`);

  try {
    const allUserData = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users', (err, result) => {
        if (err) {
          console.error(`error in fetching user data: ${err}`);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    console.log(`userData ${allUserData}`);

    res.status(200).json({
      message: 'all user data',
      user_data: allUserData
    })
    
  } catch (error) {
    console.error(`error getting user data: ${error}`);
    res.status(500).json({
      message: 'error getting user data',
    })
  }
}

exports.loginController = loginController; 
exports.resetController = resetController; 
exports.testUserController = testUserController;