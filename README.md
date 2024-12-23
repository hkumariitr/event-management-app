# Calendar App

A dynamic calendar application built with React, featuring ShadCN components for enhanced UI and event management functionality. This app allows users to add, edit, delete, and search events, with persistent storage using `localStorage`.

---

## Features

- **Dynamic Navigation**: Navigate through months with ease.
- **Event Management**: Add, edit, delete, and search for events.
- **Customizable Events**: Events can have custom titles, time ranges, descriptions, and colors.
- **Responsive Design**: Fully responsive and user-friendly interface.
- **Persistent Storage**: Events are saved locally in the browser's `localStorage`.

---

## Getting Started

### Prerequisites

- Node.js (>=14.x)
- npm (>=6.x) or yarn (>=1.22.x)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/calendar-app.git
   cd calendar-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up ShadCN components by following the official [ShadCN documentation](https://shadcn.dev/docs/components). Ensure that your component paths match the imports in the `Calendar.jsx` file.

---

### Running the App Locally

1. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. Enjoy using the Calendar App!

---

## ShadCN Integration

This project leverages ShadCN components for enhanced UI consistency and design. Below are the key components used:

- **Button**: Used for navigation and actions.
- **Dialog**: For adding and editing events.
- **Input**: For user inputs like event titles, times, and descriptions.
- **Label**: For accessible form fields.
- **Card**: To structure the calendar layout.

### How to Add ShadCN Components

1. Install the ShadCN library:
   ```bash
   npm install @shadcn/ui
   # or
   yarn add @shadcn/ui
   ```

2. Import and use the components as shown in `Calendar.jsx`:
   ```jsx
   import { Button } from "@/components/ui/button";
   import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
   import { Input } from "@/components/ui/input";
   import { Label } from "@/components/ui/label";
   import { Card, CardContent } from "@/components/ui/card";
   ```

3. Customize styles and configurations if necessary.

---

## Folder Structure

```
calendar-app/
├── public/        # Static assets
├── src/           # Source code
│   ├── components/  # Reusable UI components (e.g., ShadCN components)
│   └── pages/       # Main application pages
├── package.json  # Dependencies and scripts
└── README.md     # Project documentation
```

---

## Contributions

Contributions are welcome! Please fork the repository and submit a pull request for any new features or bug fixes.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## Acknowledgments

- [ShadCN UI Components](https://shadcn.dev/)
- [React](https://reactjs.org/)
- [Lucide Icons](https://lucide.dev/)

