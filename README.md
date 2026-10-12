# Python Flask + MySQL To-Do List App

## Setup Instructions

1. **Setup MySQL Database:**
   Import `schema.sql` into MySQL.
   ```bash
   mysql -u root -p < schema.sql
   ```

2. **Configure Database Credentials:**
   Open `app.py` and update the `db_config` dictionary with your MySQL root password.

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application:**
   ```bash
   python app.py
   ```

5. Access the app in your browser at `http://127.0.0.1:5000/`.
