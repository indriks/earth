import React from "react";
import { render, waitFor, fireEvent, act } from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAtom } from "jotai";
import CountryDetailScreen from "@/app/(tabs)/country/[id]";
import { bookmarksAtom, updateBookmarksAtom } from "@/app/atoms/bookmarkAtom";

// Mock the modules
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));
jest.mock("jotai", () => ({
  useAtom: jest.fn(),
  atom: jest.fn(),
}));
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));
jest.mock("@/app/atoms/bookmarkAtom", () => ({
  bookmarksAtom: {
    init: jest.fn(() => []),
  },
  updateBookmarksAtom: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe("CountryDetailScreen", () => {
  const mockCountryData = {
    name: { common: "Test Country", official: "Official Test Country" },
    capital: ["Test Capital"],
    region: "Test Region",
    subregion: "Test Subregion",
    population: 1000000,
    area: 100000,
    languages: { lang1: "Language 1", lang2: "Language 2" },
    currencies: { curr1: { name: "Currency 1", symbol: "$" } },
    flags: { png: "https://testflag.com/flag.png" },
    cca3: "TST",
  };

  beforeEach(() => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "TST" });
    (useRouter as jest.Mock).mockReturnValue({ setParams: jest.fn() });
    (useAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === bookmarksAtom) {
        return [[], jest.fn()];
      }
      if (atom === updateBookmarksAtom) {
        return [null, jest.fn()];
      }
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([mockCountryData]),
    });
  });

  it("renders loading state initially and then country details", async () => {
    const { findByText, getByText } = render(<CountryDetailScreen />);

    // Check for loading state
    const loadingElement = await findByText("Loading...");
    expect(loadingElement).toBeTruthy();

    // Wait for and check country details
    await waitFor(() => {
      expect(getByText("Test Country")).toBeTruthy();
      expect(getByText("Test Capital")).toBeTruthy();
      expect(getByText("Test Region")).toBeTruthy();
      expect(getByText("1,000,000")).toBeTruthy();
      expect(getByText("100,000 km²")).toBeTruthy();
      expect(getByText("Language 1, Language 2")).toBeTruthy();
      expect(getByText("Currency 1 ($)")).toBeTruthy();
    });
  });

  it("toggles bookmark when bookmark button is pressed", async () => {
    const mockUpdateBookmarks = jest.fn();
    (useAtom as jest.Mock).mockImplementation((atom) => {
      if (atom === bookmarksAtom) {
        return [[], jest.fn()];
      }
      if (atom === updateBookmarksAtom) {
        return [null, mockUpdateBookmarks];
      }
    });

    const { getByTestId, queryByText } = render(<CountryDetailScreen />);

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(queryByText("Loading...")).toBeNull();
    });

    // Wait for the bookmark button to be available
    await waitFor(() => {
      expect(getByTestId("bookmark-button")).toBeTruthy();
    });

    const bookmarkButton = getByTestId("bookmark-button");
    fireEvent.press(bookmarkButton);

    // Wait for the updateBookmarks function to be called
    await waitFor(() => {
      expect(mockUpdateBookmarks).toHaveBeenCalled();
    });
  });

  it("renders error state when fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("Fetch error"));

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { findByText } = render(<CountryDetailScreen />);

    // Wait for the error message to appear
    await waitFor(async () => {
      const errorMessage = await findByText("Error fetching country data");
      expect(errorMessage).toBeTruthy();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
