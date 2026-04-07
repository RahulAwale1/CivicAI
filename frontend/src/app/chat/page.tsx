"use client";

import { useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import CitySelector from "@/components/chat/CitySelector";
import QuestionInput from "@/components/chat/QuestionInput";
import AnswerCard from "@/components/chat/AnswerCard";
import CitationList from "@/components/chat/CitationList";
import { askQuestion, getCities } from "@/lib/api";
import type { ChatResponse, City } from "@/lib/types";

export default function ChatPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [citiesError, setCitiesError] = useState("");

  const [selectedCityId, setSelectedCityId] = useState<number | "">("");
  const [question, setQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [response, setResponse] = useState<ChatResponse | null>(null);

  useEffect(() => {
    async function loadCities() {
      try {
        setCitiesError("");
        const data = await getCities();
        setCities(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load cities";
        setCitiesError(message);
      } finally {
        setCitiesLoading(false);
      }
    }

    loadCities();
  }, []);

  async function handleAsk() {
    setChatError("");
    setResponse(null);

    if (!selectedCityId) {
      setChatError("Please select a city.");
      return;
    }

    if (!question.trim()) {
      setChatError("Please enter a question.");
      return;
    }

    try {
      setChatLoading(true);

      const result = await askQuestion({
        city_id: selectedCityId,
        question: question.trim(),
        top_k: 5,
      });

      setResponse(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to get answer";
      setChatError(message);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PageTitle
        title="Ask a By-Law Question"
        subtitle="Select a city and ask a question about its municipal by-laws."
      />

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        {citiesLoading ? (
          <Loader />
        ) : citiesError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {citiesError}
          </div>
        ) : !cities.length ? (
          <EmptyState
            title="No cities available"
            description="There are no active cities available yet."
          />
        ) : (
          <div className="space-y-6">
            <CitySelector
              cities={cities}
              selectedCityId={selectedCityId}
              onChange={setSelectedCityId}
            />

            <QuestionInput
              question={question}
              onChange={setQuestion}
              onSubmit={handleAsk}
              loading={chatLoading}
              disabled={!selectedCityId}
            />

            {chatError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {chatError}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {response ? (
        <div className="mt-6 space-y-4">
          <AnswerCard answer={response.answer} />
          <CitationList citations={response.citations} />
        </div>
      ) : null}
    </main>
  );
}