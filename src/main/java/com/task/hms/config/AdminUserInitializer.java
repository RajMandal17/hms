package com.task.hms.config;

import com.task.hms.user.model.Role;
import com.task.hms.user.model.RoleType;
import com.task.hms.user.model.User;
import com.task.hms.user.repository.RoleRepository;
import com.task.hms.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;

@Configuration
public class AdminUserInitializer {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Create roles first
            for (RoleType roleType : RoleType.values()) {
                if (roleRepository.findByName(roleType).isEmpty()) {
                    Role role = new Role();
                    role.setName(roleType);
                    roleRepository.save(role);
                    System.out.println("Inserted role: " + roleType);
                }
            }

            // Create admin user
            if (!userRepository.existsByUsername("admin")) {
                Role adminRole = roleRepository.findByName(RoleType.ADMIN)
                        .orElseThrow(() -> new RuntimeException("ADMIN role not found"));
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@hms.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRoles(Collections.singleton(adminRole));
                userRepository.save(admin);
                System.out.println("Default admin user created: admin / admin123");
            }
        };
    }

    @Bean
    public CommandLineRunner insertDefaultMedicines(
            @Autowired com.task.hms.pharmacy.repository.MedicineRepository medicineRepository,
            @Autowired com.task.hms.pharmacy.repository.MedicineBatchRepository medicineBatchRepository) {
        return args -> {
            if (medicineRepository.count() < 50) {
                String[] names = { "Paracetamol", "Ibuprofen", "Amoxicillin", "Ciprofloxacin", "Metformin",
                        "Amlodipine", "Atorvastatin", "Omeprazole", "Cetirizine", "Azithromycin", "Dolo 650",
                        "Pantoprazole", "Levocetirizine", "Losartan", "Metoprolol", "Montelukast", "Rabeprazole",
                        "Diclofenac", "Ranitidine", "Clopidogrel", "Glibenclamide", "Gliclazide", "Glimipiride",
                        "Telmisartan", "Rosuvastatin", "Ecosprin", "Drotaverine", "Domperidone", "Ondansetron",
                        "Serratiopeptidase", "Aceclofenac", "Chlorpheniramine", "Dexamethasone", "Prednisolone",
                        "Salbutamol", "Budesonide", "Formoterol", "Tiotropium", "Insulin", "Thyroxine", "Furosemide",
                        "Spironolactone", "Enalapril", "Ramipril", "Hydrochlorothiazide", "Nitroglycerin", "Isosorbide",
                        "Warfarin", "Heparin", "Vitamin D3" };
                String[] manufacturers = { "Sun Pharma", "Cipla", "Dr. Reddy's", "Lupin", "Zydus", "Torrent", "Alkem",
                        "Abbott", "Glenmark", "Mankind" };
                String[] categories = { "Tablet", "Capsule", "Syrup", "Injection", "Ointment" };
                String[] descriptions = { "Pain reliever", "Antibiotic", "Antidiabetic", "Antihypertensive", "Antacid",
                        "Antihistamine", "Cholesterol reducer", "Anti-inflammatory", "Antiplatelet", "Bronchodilator",
                        "Steroid", "Vitamin supplement" };
                java.util.Random rand = new java.util.Random();
                for (int i = 0; i < 50; i++) {
                    com.task.hms.pharmacy.model.Medicine med = new com.task.hms.pharmacy.model.Medicine();
                    med.setName(names[i % names.length]);
                    med.setManufacturer(manufacturers[rand.nextInt(manufacturers.length)]);
                    med.setCategory(categories[rand.nextInt(categories.length)]);
                    med.setDescription(descriptions[rand.nextInt(descriptions.length)]);
                    double price = 5.0 + rand.nextInt(95) + rand.nextDouble();
                    med.setPrice(price);
                    medicineRepository.save(med);
                    // Insert a default batch for each medicine
                    com.task.hms.pharmacy.model.MedicineBatch batch = new com.task.hms.pharmacy.model.MedicineBatch();
                    batch.setMedicine(med);
                    batch.setBatchNumber("BATCH-" + (i + 1));
                    batch.setCreatedAt(java.time.LocalDate.now());
                    batch.setExpiryDate(java.time.LocalDate.now().plusYears(2));
                    batch.setPurchasePrice(price * 0.8); // 80% of sale price
                    batch.setSalePrice(price);
                    batch.setQuantity(500);
                    medicineBatchRepository.save(batch);
                }
                System.out.println("Inserted 50 default medicines and batches with price");
            }
        };
    }

    @Bean
    public CommandLineRunner insertDefaultFeesAndCharges(
            @Autowired com.task.hms.billing.repository.FeeAndChargeRepository feeAndChargeRepository) {
        return args -> {
            String[][] defaults = {
                    { "ROOM", "Room Charges (per day)", "1000.0" },
                    { "PRESCRIPTION", "IPD Prescription Fee", "200.0" },
                    { "CONSULTATION", "Consultation Fee", "500.0" }
            };
            for (String[] def : defaults) {
                if (!feeAndChargeRepository.findByType(def[0]).isPresent()) {
                    com.task.hms.billing.model.FeeAndCharge fee = new com.task.hms.billing.model.FeeAndCharge();
                    fee.setType(def[0]);
                    fee.setDescription(def[1]);
                    fee.setAmount(Double.valueOf(def[2]));
                    feeAndChargeRepository.save(fee);
                    System.out.println("Inserted fee/charge: " + def[0]);
                }
            }
        };
    }
}
