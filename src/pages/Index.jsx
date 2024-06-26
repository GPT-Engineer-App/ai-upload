import React, { useState } from "react";
import { Container, VStack, Input, Button, Text, useToast } from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa";


const Index = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem("openaiApiKey") || "");
  const [file, setFile] = useState(null);
  const toast = useToast();

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSaveApiKey = () => {
    localStorage.setItem("openaiApiKey", apiKey);
    toast({
      title: "API Key Saved",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleTranscribe = async () => {
    if (!apiKey) {
      toast({
        title: "API Key is required",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (!file) {
      toast({
        title: "Please upload a file",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-1");

    try {
      const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      toast({
        title: "Transcription Success",
        description: data.text,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Transcription Failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Whisper Transcription Service</Text>
        <Input
          placeholder="Enter OpenAI API Key"
          value={apiKey}
          onChange={handleApiKeyChange}
        />
        <Button onClick={handleSaveApiKey}>Save API Key</Button>
        <Input type="file" onChange={handleFileChange} />
        <Button leftIcon={<FaUpload />} onClick={handleTranscribe}>
          Upload and Transcribe
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;