#!/bin/bash
# Test Insurance Claims API for Billing Page

TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc1MTYzNzIwOSwiZXhwIjoxNzUxNzIzNjA5fQ.4BlfLxpNE_Hf7QLE6Brfe6V1uw6YwLU_RiKY4CfDuF0"
API_URL="http://localhost:8080"

# 1. Get all patients
echo "\n--- Get All Patients ---"
curl -s -w "\n" -H "Authorization: Bearer $TOKEN" "$API_URL/api/patients"

# 2. Get all bills
echo "\n--- Get All Bills ---"
curl -s -w "\n" -H "Authorization: Bearer $TOKEN" "$API_URL/api/bills"

# 3. Get insurance claims for patient 1
echo "\n--- Get Insurance Claims by Patient (patientId=1) ---"
curl -s -w "\n" -H "Authorization: Bearer $TOKEN" "$API_URL/api/insurance-claims/patient/1"

# 4. Submit insurance claim for bill 1
echo "\n--- Submit Insurance Claim for Bill 1 ---"
curl -s -w "\n" -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"tpaName":"Test TPA","claimNumber":"CLM123","claimedAmount":400}' \
  "$API_URL/api/insurance-claims/bill/1"

# 5. Get claim documents for claim 1
echo "\n--- Get Claim Documents (claimId=1) ---"
curl -s -w "\n" -H "Authorization: Bearer $TOKEN" "$API_URL/api/insurance-claims/1/documents"

# 6. Upload claim document for claim 1 (dummy file)
# Uncomment and provide a real file path to test upload
# echo "\n--- Upload Claim Document (claimId=1) ---"
# curl -s -w "\n" -X POST -H "Authorization: Bearer $TOKEN" -F "file=@/path/to/document.pdf" "$API_URL/api/insurance-claims/1/documents"
