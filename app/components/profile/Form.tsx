import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppModal from "../modal/AppModal";
import { useModal } from "@/hooks/useModal";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState, useCallback } from "react";
import useUsersStore from "@/store/useUsersStore";
import { clearAuthData, getAuthData } from "@/services/secureStore";
import { useRouter } from "expo-router";

// Reusable gradient button component
const GradientButton = ({ title, onPress }: { title: string; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={styles.button}>
        <LinearGradient colors={["#1F73C6", "#F7941E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
            <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
    </TouchableOpacity>
);

type Props = {
    isPresent?: boolean;
    onClose?: () => void;
    closeText?: string;
    users?: any;
};

export default function Form({ isPresent, onClose, closeText = "Skip", users }: Props) {
    const modal = useModal();
    const router = useRouter();
    const { fetchUserByPhoneNumber, updateUser } = useUsersStore();

    const [userData, setUserData] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        jobTitle: '',
        email: '',
        username: '',
        businessName: '',
        businessType: '',
        udyamNumber: '',
        gstNumber: '',
        // address: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setFormData({
            name: users?.name ?? '',
            jobTitle: users?.jobTitle ?? '',
            email: users?.email ?? '',
            username: users?.username ?? '',
            businessName: users?.businessName ?? '',
            businessType: users?.businessType ?? '',
            udyamNumber: users?.udyamNumber ?? '',
            gstNumber: users?.gstNumber ?? '',
            // address: users?.location ?? '',
        });
    }, [users]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authData = await getAuthData();
                const resp = await fetchUserByPhoneNumber(authData?.userData?.data?.phone);

                if (resp?.data?.statusCode === 200) {
                    setUserData(resp.data.data);
                    setIsVisible(!resp.data.data?.isSkip);
                } else {
                    clearAuthData();
                    router.replace('/(auth)/login');
                }
            } catch (error) {
                console.error("Error fetching user by phone number:", error);
            }
        };
        fetchData();
    }, [fetchUserByPhoneNumber]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Enter a valid email";
        if (!formData.businessName) newErrors.businessName = "Business name is required";
        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.jobTitle) newErrors.jobTitle = "Job title is required";
        if (!formData.businessType) newErrors.businessType = "Business type is required";
        // if (!formData.udyamNumber) newErrors.udyamNumber = "Udyam number is required";
        if (!formData.gstNumber) newErrors.gstNumber = "GST number is required";
        // if (!formData.address) newErrors.address = "Address is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleSkip = async () => {
        try {
            if (isPresent) return onClose?.();

            modal.close();
            const resp = await updateUser(userData?._id, { isSkip: true });
            if (resp?.data?.statusCode === 201 || resp?.data?.statusCode === 200) {
                setUserData(resp.data.data);
                setIsVisible(false);
            } else {
                throw new Error(resp.data?.error || 'Unknown error');
            }
        } catch (error: any) {
            setErrors({ apiError: error.message });
            console.error("Error skipping profile update:", error);
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const resp = await updateUser(userData?._id, { ...formData, isSkip: true });
            if (resp?.data?.statusCode === 201 || resp?.data?.statusCode === 200) {
                setUserData(resp.data.data);
                setIsVisible(false);
                onClose?.();
            } else {
                throw new Error(resp.data?.message || "Failed to update user");
            }
        } catch (error: any) {
            console.error("Error updating user:", error);
            setErrors({ apiError: error.message });
        }
    };

    const renderField = (placeholder: string, field: keyof typeof formData) => (
        <View style={styles.inputContainer}>
            <TextInput
                placeholder={placeholder}
                value={formData[field]}
                onChangeText={(text) => handleChange(field, text)}
                style={[styles.input, errors[field] && { borderColor: 'red' }]}
                autoCapitalize="none"
            />
            {errors[field] && <Text style={{ color: 'red' }}>{errors[field]}</Text>}
        </View>
    );

    return (
        <AppModal visible={!!(isPresent ?? isVisible)} onClose={modal.close}>
            <View style={styles.container}>
                <Text style={{ fontSize: 18, marginBottom: 10 }}>Update Profile</Text>

                {renderField("Name", "name")}
                {renderField("Job Title", "jobTitle")}
                {renderField("Email Address", "email")}
                {renderField("Username", "username")}
                {renderField("Business Name", "businessName")}
                {renderField("Business Type", "businessType")}
                {renderField("Udyam Number", "udyamNumber")}
                {renderField("GST Number", "gstNumber")}
                {/* {renderField("Address/Location", "address")} */}

                {errors.apiError && <Text style={{ color: 'red' }}>{errors.apiError}</Text>}

                <View style={{ flexDirection: 'row', justifyContent: "space-between", width: '95%' }}>
                    {/* <GradientButton title={closeText} onPress={handleSkip} /> */}
                    <GradientButton title="Submit" onPress={handleSubmit} />
                </View>
            </View>
        </AppModal>
    );
}

const styles = StyleSheet.create({
    button: { padding: 10, borderRadius: 5, width: "100%" },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 12, textAlign: "center" },
    inputContainer: { width: '90%', marginVertical: 5 },
    input: { height: 44, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 12 },
});
