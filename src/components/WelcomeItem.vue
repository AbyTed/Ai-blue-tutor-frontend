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
          Discover a new way to enhance your skills with our interactive tutorials, expert guidance, and personalized learning experience. Join us today and unlock your potential!
        </slot>
      </p>
    </div>
  </div>
</template>

<style scoped>
.item {
  margin-top: 2rem;
  display: flex;
  position: relative;
  background-color: #f9f9f9; /* Light gray background */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  padding: 1rem;
}

.details {
  flex: 1;
  margin-left: 1rem;
}

i {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-size: 2rem;
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

h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333; /* Dark gray color */
}

p {
  font-size: 1rem;
  color: #666; /* Gray text color */
  line-height: 1.6;
}

@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: 1rem;
    /* Adjust padding if needed */
  }

  .item:before,
  .item:after {
    content: ' ';
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
@media (min-width:1024px){
  .item{
    width: 50rem;
  }
  
}
</style>
