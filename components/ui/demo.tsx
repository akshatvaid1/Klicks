import { ProfileSelector, ProfileIcon } from "@/components/ui/profile-selector"; // Adjust path as needed
import { Plus } from "lucide-react"; // Using lucide-react for icons

/**
 * A demo showcasing the ProfileSelector component with image URLs.
 */
export default function ProfileSelectorDemo() {
  // Sample data using image URLs for profiles
  const sampleProfiles = [
    {
      id: "Ravi",
      label: "Ravi",
      // Using a placeholder image service for the demo icon
      icon: "https://vucvdpamtrjkzmubwlts.supabase.co/storage/v1/object/public/users/user_2zMtrqo9RMaaIn4f8F2z3oeY497/avatar.png",
    },
    {
      id: "vaib",
      label: "Vaib",
      // Using a placeholder image service for the demo icon
      icon: "https://plus.unsplash.com/premium_photo-1739163838574-27c663e8a22b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfDJ8MHx8fDA%3D&auto=format&fit=crop&q=60&w=900",
    },
    {
      id: "kids",
      label: "Kids",
      // Using a placeholder image service for the demo icon
      icon: "https://plus.unsplash.com/premium_photo-1739206781762-6b28bac44141?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2ZpbGV8ZW58MHwyfDB8fHww&auto=format&fit=crop&q=60&w=900",
    },
    {
      id: "add",
      label: "Add",
      // The 'Add' button can still be a React component for flexibility
      icon: (
        <ProfileIcon className="bg-foreground/5">
          <Plus className="h-12 w-12 text-muted-foreground" />
        </ProfileIcon>
      ),
    },
  ];

  // Handler for when a profile is selected
  const handleProfileSelect = (id: string) => {
    if (id === "add") {
      alert("Add new profile action triggered!");
    } else {
      alert(`Profile selected: ${id}`);
    }
  };

  return (
    <ProfileSelector profiles={sampleProfiles} onProfileSelect={handleProfileSelect} />
  );
}
