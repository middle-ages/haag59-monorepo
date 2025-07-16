export const config = {
  test: {
    globals: true,
    typecheck: {
      enabled: true,
    },
    include: ['./src/**/*.test.ts', './src/**/*.test-d.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './node_modules/.coverage',
      exclude: [
        './dist',
        './config',
        './src/internal.d.ts',
        './src/test.ts',
        './src/test.setup.ts',
        './src/test/**/*',
        './src/**/types.ts',
        './src/**/*.test.ts',
        './src/**/*.test-d.ts',
      ],
    },
  },
} as const
