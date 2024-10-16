const createURL = (path: string) => {
  return window.location.origin + path;
};

export const createNewEntry = async () => {
  try {
    const res = await fetch(
      new Request(createURL("/api/journal"), {
        method: "POST",
        // body: JSON.stringify()
      })
    );

    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateEntry = async (id: string, content: string) => {
  try {
    const res = await fetch(new Request(createURL(`/api/journal/${id}`)), {
      method: "PATCH",
      body: JSON.stringify({ content }),
      headers: new Headers({}),
    });

    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (error) {
    throw new Error(`error:: ${error}`);
  }
};

export const askQuestion = async (question: any) => {
  const res = await fetch(new Request(createURL("/api/question")), {
    method: "POST",
    body: JSON.stringify({ question }),
  });
  if (res.ok) {
    const data = await res.json();
    return data.data;
  }
};
