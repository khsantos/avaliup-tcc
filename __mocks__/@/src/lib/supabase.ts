export const supabase = {
  auth: {
    signInWithPassword: jest.fn().mockResolvedValue({
      data: {
        user: { id: "123", email: "teste@exemplo.com" },
        session: { access_token: "fake_token" },
      },
      error: null,
    }),

    signInWithOAuth: jest.fn().mockResolvedValue({ error: null }),

    setSession: jest.fn().mockResolvedValue({}),

    signOut: jest.fn().mockResolvedValue({ error: null }),

    signUp: jest.fn().mockResolvedValue({
      data: { user: { id: "mock-user-id", email: "novo@teste.com" } },
      error: null,
    }),
  },

  from: jest.fn(() => ({
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        data: [{ id: "123", email: "teste@exemplo.com" }],
        error: null,
      })),
    })),

    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn().mockResolvedValue({
          data: { two_factor_enabled: false },
          error: null,
        }),
        maybeSingle: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
        data: [{ id: "123", email: "teste@exemplo.com" }],
        error: null,
      })),
    })),

    insert: jest.fn(() => ({
      data: [{ id: "123" }],
      error: null,
    })),
  })),
};
