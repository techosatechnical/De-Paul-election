"use server";

import { db } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  runTransaction
} from "firebase/firestore";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

// Initialize Supabase client for image storage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function createSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or key is missing in environment variables");
  }
  return createClient(supabaseUrl, supabaseKey);
}

export async function getElectionTitles() {
  try {
    const electionsCol = collection(db, "elections");
    const querySnapshot = await getDocs(electionsCol);
    const titles = querySnapshot.docs.map((d) => d.data().title);
    return { titles };
  } catch (error) {
    console.error("Error fetching election titles:", error.stack);
    return { error: "Failed to fetch election titles: " + error.message };
  }
}

export async function getElection(electionTitle) {
  try {
    const electionDocRef = doc(db, "elections", electionTitle.toLowerCase());
    const electionDoc = await getDoc(electionDocRef);
    if (!electionDoc.exists()) {
      return { error: "Election not found" };
    }
    const electionData = electionDoc.data();

    // Fetch categories subcollection
    const categoriesColRef = collection(db, "elections", electionTitle.toLowerCase(), "categories");
    const categoriesSnapshot = await getDocs(categoriesColRef);
    const categories = categoriesSnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        title: data.title,
        nominees: Array.isArray(data.nominees)
          ? data.nominees.map((nominee) => ({
            name: nominee.name,
            photo: nominee.photo || null,
            logo: nominee.logo || null,
            votes: nominee.votes || 0,
          }))
          : [],
      };
    });

    return {
      title: electionData.title,
      categories,
    };
  } catch (error) {
    console.error("Error fetching election:", error.stack);
    return { error: "Failed to fetch election: " + error.message };
  }
}

export async function verifyElectionPassword(title, password) {
  try {
    const electionDocRef = doc(db, "elections", title.toLowerCase());
    const electionDoc = await getDoc(electionDocRef);
    if (!electionDoc.exists()) {
      return { valid: false, error: "Election not found" };
    }
    const electionData = electionDoc.data();
    const isValid = await bcrypt.compare(password, electionData.password);
    return { valid: isValid, error: isValid ? null : "Invalid password" };
  } catch (error) {
    console.error("Error verifying password:", error.stack);
    return {
      valid: false,
      error: "Failed to verify password: " + error.message,
    };
  }
}

export async function createElection(title, password) {
  try {
    const electionDocRef = doc(db, "elections", title.toLowerCase());
    const electionDoc = await getDoc(electionDocRef);
    if (electionDoc.exists()) {
      return { error: "Election already exists" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await setDoc(electionDocRef, {
      title,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    });
    return { message: "Election created successfully" };
  } catch (error) {
    console.error("Error creating election:", error.stack);
    return { error: "Failed to create election: " + error.message };
  }
}

export async function addCategory(electionTitle, categoryTitle, password) {
  try {
    const electionDocRef = doc(db, "elections", electionTitle.toLowerCase());
    const electionDoc = await getDoc(electionDocRef);
    if (!electionDoc.exists()) {
      return { error: "Election not found" };
    }
    const electionData = electionDoc.data();
    const isValid = await bcrypt.compare(password, electionData.password);
    if (!isValid) {
      return { error: "Invalid election password" };
    }

    const categoryDocRef = doc(db, "elections", electionTitle.toLowerCase(), "categories", categoryTitle.toLowerCase());
    const categoryDoc = await getDoc(categoryDocRef);
    if (categoryDoc.exists()) {
      return { error: "Category already exists in this election" };
    }

    await setDoc(categoryDocRef, {
      title: categoryTitle,
      nominees: [],
    });
    return { message: "Category added successfully" };
  } catch (error) {
    console.error("Error adding category:", error.stack);
    return { error: "Failed to add category: " + error.message };
  }
}

export async function updateCategory({
  electionTitle,
  originalCategoryTitle,
  newCategoryTitle,
  password,
}) {
  try {
    const electionDocRef = doc(db, "elections", electionTitle.toLowerCase());
    const electionDoc = await getDoc(electionDocRef);
    if (!electionDoc.exists()) {
      return { error: "Election not found" };
    }
    const electionData = electionDoc.data();
    const isValid = await bcrypt.compare(password, electionData.password);
    if (!isValid) {
      return { error: "Invalid election password" };
    }

    const oldCategoryDocRef = doc(db, "elections", electionTitle.toLowerCase(), "categories", originalCategoryTitle.toLowerCase());
    const newCategoryDocRef = doc(db, "elections", electionTitle.toLowerCase(), "categories", newCategoryTitle.toLowerCase());

    if (originalCategoryTitle.toLowerCase() !== newCategoryTitle.toLowerCase()) {
      const newCategoryDoc = await getDoc(newCategoryDocRef);
      if (newCategoryDoc.exists()) {
        return { error: "Category title already exists" };
      }
    }

    const oldCategoryDoc = await getDoc(oldCategoryDocRef);
    if (!oldCategoryDoc.exists()) {
      return { error: "Category not found" };
    }
    const categoryData = oldCategoryDoc.data();

    // Write the new category document
    await setDoc(newCategoryDocRef, {
      title: newCategoryTitle,
      nominees: categoryData.nominees || [],
    });

    // Delete the old category document if the key has changed
    if (originalCategoryTitle.toLowerCase() !== newCategoryTitle.toLowerCase()) {
      await deleteDoc(oldCategoryDocRef);
    }

    return { message: "Category updated successfully" };
  } catch (error) {
    console.error("Error updating category:", error.stack);
    return { error: "Failed to update category: " + error.message };
  }
}

export async function deleteCategory(electionTitle, categoryTitle, password) {
  try {
    const electionDocRef = doc(db, "elections", electionTitle.toLowerCase());
    const electionDoc = await getDoc(electionDocRef);
    if (!electionDoc.exists()) {
      return { error: "Election not found" };
    }
    const electionData = electionDoc.data();
    const isValid = await bcrypt.compare(password, electionData.password);
    if (!isValid) {
      return { error: "Invalid election password" };
    }

    const categoryDocRef = doc(db, "elections", electionTitle.toLowerCase(), "categories", categoryTitle.toLowerCase());
    await deleteDoc(categoryDocRef);
    return { message: "Category deleted successfully" };
  } catch (error) {
    console.error("Error deleting category:", error.stack);
    return { error: "Failed to delete category: " + error.message };
  }
}

export async function deleteElection(title, password) {
  try {
    const electionDocRef = doc(db, "elections", title.toLowerCase());
    const electionDoc = await getDoc(electionDocRef);
    if (!electionDoc.exists()) {
      return { error: "Election not found" };
    }
    const electionData = electionDoc.data();
    const isValid = await bcrypt.compare(password, electionData.password);
    if (!isValid) {
      return { error: "Invalid election password" };
    }

    // Delete all documents in the categories subcollection first
    const categoriesColRef = collection(db, "elections", title.toLowerCase(), "categories");
    const categoriesSnapshot = await getDocs(categoriesColRef);
    const deletePromises = categoriesSnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);

    // Delete the main election document
    await deleteDoc(electionDocRef);
    return { message: "Election deleted successfully" };
  } catch (error) {
    console.error("Error deleting election:", error.stack);
    return { error: "Failed to delete election: " + error.message };
  }
}

export async function addCandidate({
  electionTitle,
  categoryTitle,
  candidateName,
  photoFile,
  logoFile,
}) {
  try {
    const electionDocRef = doc(db, "elections", electionTitle.toLowerCase());
    const electionDoc = await getDoc(electionDocRef);
    if (!electionDoc.exists()) {
      return { error: "Election not found" };
    }

    const categoryDocRef = doc(db, "elections", electionTitle.toLowerCase(), "categories", categoryTitle.toLowerCase());
    const categoryDoc = await getDoc(categoryDocRef);
    if (!categoryDoc.exists()) {
      return { error: "Category not found" };
    }
    const categoryData = categoryDoc.data();
    const nominees = categoryData.nominees || [];
    if (nominees.some((nominee) => nominee.name === candidateName)) {
      return { error: "Candidate already exists in this category" };
    }

    const supabase = await createSupabaseClient();
    let photoUrl = "";
    let logoUrl = "";
    const uploadedFiles = [];

    // Upload photo
    if (photoFile) {
      const photoFileExt = photoFile.name.split(".").pop();
      const photoFileName = `photo_${Date.now()}.${photoFileExt}`;
      const { error: photoUploadError } = await supabase.storage
        .from("election")
        .upload(photoFileName, photoFile);
      if (photoUploadError) {
        console.error("Photo upload error:", photoUploadError);
        return { error: `Failed to upload photo: ${photoUploadError.message}` };
      }
      const { data: photoData } = supabase.storage
        .from("election")
        .getPublicUrl(photoFileName);
      photoUrl = photoData.publicUrl;
      uploadedFiles.push(photoFileName);
    }

    // Upload logo
    if (logoFile) {
      const logoFileExt = logoFile.name.split(".").pop();
      const logoFileName = `logo_${Date.now()}.${logoFileExt}`;
      const { error: logoUploadError } = await supabase.storage
        .from("election")
        .upload(logoFileName, logoFile);
      if (logoUploadError) {
        console.error("Logo upload error:", logoUploadError);
        // Clean up uploaded photo if logo upload fails
        if (photoUrl) {
          await supabase.storage.from("election").remove([uploadedFiles[0]]);
        }
        return { error: `Failed to upload logo: ${logoUploadError.message}` };
      }
      const { data: logoData } = supabase.storage
        .from("election")
        .getPublicUrl(logoFileName);
      logoUrl = logoData.publicUrl;
      uploadedFiles.push(logoFileName);
    }

    const newNominee = {
      name: candidateName,
      photo: photoUrl || null,
      logo: logoUrl || null,
      votes: 0,
    };

    await updateDoc(categoryDocRef, {
      nominees: [...nominees, newNominee],
    });

    return { message: "Candidate added successfully", photoUrl, logoUrl };
  } catch (error) {
    console.error("Error adding candidate:", error.stack);
    return { error: "Failed to add candidate: " + error.message };
  }
}

export async function updateCandidate({
  electionTitle,
  categoryTitle,
  originalName,
  newName,
  newPhotoFile,
  newLogoFile,
}) {
  try {
    const electionDocRef = doc(db, "elections", electionTitle.toLowerCase());
    const electionDoc = await getDoc(electionDocRef);
    if (!electionDoc.exists()) {
      return { error: "Election not found" };
    }

    const categoryDocRef = doc(db, "elections", electionTitle.toLowerCase(), "categories", categoryTitle.toLowerCase());
    const categoryDoc = await getDoc(categoryDocRef);
    if (!categoryDoc.exists()) {
      return { error: "Category not found" };
    }
    const categoryData = categoryDoc.data();
    const nominees = categoryData.nominees || [];

    if (nominees.some((n) => n.name === newName && originalName !== newName)) {
      return { error: "Candidate name already exists in this category" };
    }

    const currentNominee = nominees.find((n) => n.name === originalName);
    if (!currentNominee) {
      return { error: "Candidate not found" };
    }

    const supabase = await createSupabaseClient();
    let photoUrl = currentNominee.photo;
    let logoUrl = currentNominee.logo;
    const uploadedFiles = [];

    // Upload new photo if provided
    if (newPhotoFile) {
      const photoFileExt = newPhotoFile.name.split(".").pop();
      const photoFileName = `photo_${Date.now()}.${photoFileExt}`;
      const { error: photoUploadError } = await supabase.storage
        .from("election")
        .upload(photoFileName, newPhotoFile);
      if (photoUploadError) {
        console.error("Photo upload error:", photoUploadError);
        return { error: `Failed to update photo: ${photoUploadError.message}` };
      }
      const { data: photoData } = supabase.storage
        .from("election")
        .getPublicUrl(photoFileName);
      photoUrl = photoData.publicUrl;
      uploadedFiles.push(photoFileName);
    }

    // Upload new logo if provided
    if (newLogoFile) {
      const logoFileExt = newLogoFile.name.split(".").pop();
      const logoFileName = `logo_${Date.now()}.${logoFileExt}`;
      const { error: logoUploadError } = await supabase.storage
        .from("election")
        .upload(logoFileName, newLogoFile);
      if (logoUploadError) {
        console.error("Logo upload error:", logoUploadError);
        if (uploadedFiles.length > 0) {
          await supabase.storage.from("election").remove(uploadedFiles);
        }
        return { error: `Failed to update logo: ${logoUploadError.message}` };
      }
      const { data: logoData } = supabase.storage
        .from("election")
        .getPublicUrl(logoFileName);
      logoUrl = logoData.publicUrl;
      uploadedFiles.push(logoFileName);
    }

    const updatedNominees = nominees.map((n) => {
      if (n.name === originalName) {
        return {
          ...n,
          name: newName,
          photo: photoUrl || null,
          logo: logoUrl || null,
        };
      }
      return n;
    });

    await updateDoc(categoryDocRef, {
      nominees: updatedNominees,
    });

    return { message: "Candidate updated successfully" };
  } catch (error) {
    console.error("Error updating candidate:", error.stack);
    return { error: "Failed to update candidate: " + error.message };
  }
}

export async function deleteCandidate({
  electionTitle,
  categoryTitle,
  candidateName,
}) {
  try {
    const categoryDocRef = doc(db, "elections", electionTitle.toLowerCase(), "categories", categoryTitle.toLowerCase());
    const categoryDoc = await getDoc(categoryDocRef);
    if (!categoryDoc.exists()) {
      return { error: "Category or election not found" };
    }
    const categoryData = categoryDoc.data();
    const nominees = categoryData.nominees || [];
    const updatedNominees = nominees.filter((n) => n.name !== candidateName);

    await updateDoc(categoryDocRef, {
      nominees: updatedNominees,
    });

    return { message: "Candidate deleted successfully" };
  } catch (error) {
    console.error("Error deleting candidate:", error.stack);
    return { error: "Failed to delete candidate: " + error.message };
  }
}

export async function submitVotes(formData) {
  try {
    const votes = JSON.parse(formData.get("votes"));

    if (!Array.isArray(votes) || votes.length === 0) {
      console.error("Invalid vote submission: Expected non-empty array");
      return { error: "Valid votes are required" };
    }

    const electionTitle = votes[0]?.electionTitle;
    const electionDocRef = doc(db, "elections", electionTitle.toLowerCase());
    const electionDoc = await getDoc(electionDocRef);
    if (!electionDoc.exists()) {
      return { error: "Election not found" };
    }

    // Fetch all categories from Firestore
    const categoriesColRef = collection(db, "elections", electionTitle.toLowerCase(), "categories");
    const categoriesSnapshot = await getDocs(categoriesColRef);
    const allCategories = categoriesSnapshot.docs.map((d) => d.data().title);

    // Exclude UP Head Boy and UP Head Girl (same logic as the client)
    const validCategories = allCategories.filter((title) => {
      const t = title.toLowerCase().replace(/[^a-z]/g, '');
      return !(t.includes("upheadboy") || (t.includes("up") && t.includes("headboy")) ||
        t.includes("upheadgirl") || (t.includes("up") && t.includes("headgirl")));
    });
    const validCategoriesLower = validCategories.map((c) => c.toLowerCase());

    const invalidVotes = votes.filter(
      (v) =>
        !validCategoriesLower.includes(v.categoryTitle.toLowerCase()) ||
        v.electionTitle.toLowerCase() !== electionTitle.toLowerCase()
    );

    if (invalidVotes.length > 0) {
      console.error("Invalid vote submission: Some categories are invalid");
      return {
        error: "All votes must correspond to valid categories in the election",
      };
    }

    if (votes.length !== validCategories.length) {
      console.error("Invalid vote submission length");
      return { error: `Exactly ${validCategories.length} votes are required` };
    }

    // Run standard Firestore transaction to atomically update vote counts
    await runTransaction(db, async (transaction) => {
      // 1. Fetch all category documents first
      const docRefs = votes.map((vote) =>
        doc(db, "elections", electionTitle.toLowerCase(), "categories", vote.categoryTitle.toLowerCase())
      );

      const docSnaps = [];
      for (const ref of docRefs) {
        docSnaps.push(await transaction.get(ref));
      }

      // 2. Perform updates
      for (let i = 0; i < votes.length; i++) {
        const vote = votes[i];
        const docSnap = docSnaps[i];
        const ref = docRefs[i];

        if (!docSnap.exists()) {
          throw new Error(`Category document for ${vote.categoryTitle} not found`);
        }

        const data = docSnap.data();
        const nominees = data.nominees || [];
        const updatedNominees = nominees.map((nominee) => {
          if (nominee.name === vote.nomineeName) {
            return { ...nominee, votes: (nominee.votes || 0) + 1 };
          }
          return nominee;
        });

        transaction.update(ref, { nominees: updatedNominees });
      }
    });

    return { message: "Votes submitted successfully" };
  } catch (error) {
    console.error("Error submitting votes:", error.stack);
    return { error: "Failed to submit votes: " + error.message };
  }
}

export async function getVoterCount(electionTitle) {
  try {
    const categoriesColRef = collection(db, "elections", electionTitle.toLowerCase(), "categories");
    const categoriesSnapshot = await getDocs(categoriesColRef);
    const categories = categoriesSnapshot.docs.map((docSnap) => docSnap.data());

    const totalVotes = categories.reduce((sum, category) => {
      const categoryVotes = Array.isArray(category.nominees)
        ? category.nominees.reduce(
          (voteSum, nominee) => voteSum + (nominee.votes || 0),
          0
        )
        : 0;
      return sum + categoryVotes;
    }, 0);

    const categoryCount = categories.length;
    const voterCount =
      categoryCount > 0 ? Math.floor(totalVotes / categoryCount) : 0;

    return { count: voterCount };
  } catch (error) {
    console.error("Error fetching voter count:", error.stack);
    return { error: "Failed to fetch voter count: " + error.message };
  }
}

export async function getElectionWinners(electionTitle) {
  try {
    const categoriesColRef = collection(db, "elections", electionTitle.toLowerCase(), "categories");
    const categoriesSnapshot = await getDocs(categoriesColRef);
    const categories = categoriesSnapshot.docs.map((docSnap) => docSnap.data());

    const results = categories.map((category) => {
      const nominees = Array.isArray(category.nominees)
        ? category.nominees
        : [];
      const winner = nominees.reduce(
        (prev, curr) => (curr.votes > prev.votes ? curr : prev),
        { votes: -1, name: "" }
      );
      return {
        title: category.title,
        nominees: nominees.map((nominee) => ({
          name: nominee.name,
          votes: nominee.votes || 0,
          photo: nominee.photo || null,
          logo: nominee.logo || null,
        })),
        winner: winner.name || "No nominees",
      };
    });

    return { results };
  } catch (error) {
    console.error("Error fetching election results:", error.stack);
    return { error: "Failed to fetch election results: " + error.message };
  }
}
