#!/bin/bash

echo "=== CourseClash Activities Database Replication Verification ==="
echo ""

# Wait for services to be healthy
echo "1. Checking if services are running..."
sudo docker compose ps cc_activities_db cc_activities_db_read

echo ""
echo "2. Checking master replication status..."
sudo docker compose exec cc_activities_db mysql -u root -ppassword -e "SHOW MASTER STATUS;"

echo ""
echo "3. Checking slave replication status..."
sudo docker compose exec cc_activities_db_read mysql -u root -ppassword -e "SHOW SLAVE STATUS\G"

echo ""
echo "4. Testing replication - Creating test table in master..."
sudo docker compose exec cc_activities_db mysql -u root -ppassword activities_db -e "
CREATE TABLE IF NOT EXISTS replication_test (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_data VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO replication_test (test_data) VALUES ('Test replication data');
"

echo ""
echo "5. Waiting 3 seconds for replication..."
sleep 3

echo ""
echo "6. Verifying data appears in read replica..."
sudo docker compose exec cc_activities_db_read mysql -u root -ppassword activities_db -e "
SELECT * FROM replication_test;
"

echo ""
echo "7. Cleaning up test table..."
sudo docker compose exec cc_activities_db mysql -u root -ppassword activities_db -e "DROP TABLE IF EXISTS replication_test;"

echo ""
echo "=== Replication verification complete ==="
echo ""
echo "If you see the test data in step 6, replication is working correctly!"
echo "If not, check the slave status in step 3 for any error messages." 