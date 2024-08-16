<template>
  <div class="item">
    <i>
      <slot name="icon"></slot>
    </i>
    <div class="details">
      <div class="heading">
        <h1>Welcome to Blue Tutor</h1>
      </div>
      <h3>
        <slot name="heading">Empower Your Learning Journey</slot>
      </h3>
      <p>
        <slot>
          Introducing Blue Tutor!

          Blue Tutor is an easy-to-use AI tool designed especially for young students. With just a click, kids can take a picture of their assignment or any educational material, and Blue Tutor will instantly provide a helpful response. For added convenience, it also offers audio feedback.

          Perfect for grades 3-8, Blue Tutor makes learning straightforward and fun without any complicated setups. It’s your child’s friendly assistant for quick, reliable help anytime!
          <br /><br />
          Why Choose Blue Tutor?
          <ul>
            <li><strong>Instant Assistance:</strong> Simply click and take a picture to get a helpful response and audio feedback instantly.</li>
            <li><strong>Easy to Use:</strong> Designed for young students, making learning simple and fun without complicated processes.</li>
            <li><strong>Supports English Learning:</strong> Ideal for students in grades 3-8 to enhance their learning experience effortlessly.</li>
          </ul>
          <br />
          Start your child’s learning adventure today with Blue Tutor and see how easy and enjoyable learning can be!
        </slot>
      </p>
    </div>
  </div>
</template>



<style scoped>
.item {
  display: flex;
  align-items: flex-start; /* Align items to the top */
  background-color: #f9f9f9; /* Light gray background */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  padding: 2rem; /* Increased padding for better spacing */
  position: relative;
  max-width: 800px; /* Limiting maximum width */
  margin: 2rem auto 2rem; /* Centering and margin for the component */
}

.details {
  flex: 1;
  margin-left: 1rem;
}

i {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  font-size: 2.5rem;
  color: #2196F3; /* Blue color for icon */
}

.heading {
  text-align: center;
  padding: 1rem;
  border: 2px solid #2196F3; /* Blue border */
  border-radius: 8px; /* Rounded corners */
  background-color: #e3f2fd; /* Light blue background */
  color: #2196F3; /* Blue text color */
  margin-bottom: 1rem;
}

h1 {
  font-size: 2rem; /* Adjusted font size for h1 */
  font-weight: 600; /* Font weight for emphasis */
  color: #333; /* Dark gray color */
}

h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333; /* Dark gray color */
}

p {
  font-size: 1rem;
  color: #666; /* Gray text color */
  line-height: 1.6; /* Line height for readability */
}

ul {
  list-style-type: disc; /* Bulleted list style */
  padding-left: 1.5rem; /* Padding for list items */
}

ul li {
  margin-bottom: 0.5rem; /* Spacing between list items */
}

@media (min-width: 1024px) {
  .item {
    width: 50rem; /* Fixed width for larger screens */
    margin-top: 0; /* Remove top margin on larger screens */
    padding: 2rem; /* Increased padding for better spacing */
  }

  .item:before,
  .item:after {
    content: '';
    border-left: 1px solid #ddd; /* Light gray border */
    position: absolute;
    left: 0;
    width: 1px;
  }

  .item:before {
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:after {
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
}
</style>
