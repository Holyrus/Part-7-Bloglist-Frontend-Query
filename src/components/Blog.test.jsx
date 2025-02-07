// Test writes in the same directory as the component being tested. 

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

// The first test verifies that the component renders the contents of the blog:

test('Renders content of the blog', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'www.testurl.com',
    likes: 5
  }

  // Verification by finding text on the screen

  // render(<Blog blog={blog} />)

  // We use screen's method 'getByText' to search an element that has the blog title and ensure that it exists.
  // const element = screen.getByText('Component testing is done with react-testing-library')
  // The existence of the element is verified with the 'toBeDefined' matcher which tests whether the element argument of expect exists.
  // expect(element).toBeDefined()

  // --------------------------------------------

  // Verification by using CSS-selectors to find rendered elements

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  expect(div).toHaveTextContent(
    'Test Author'
  )
  expect(div).not.toHaveTextContent(
    'www.testurl.com'
  )

  // ---------------------------------------------

  // For print the HTML of a component to the terminal
  screen.debug()
  // ---------------------------------------------

  // For print a wanted element to console
  // screen.debug(element)
  // ---------------------------------------------
})

// Test for checking the functionality of clicking button

test('Clicking the button reveal the URL and number of Likes', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'www.testurl.com',
    likes: 5
  }

  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('View')
  await user.click(button)

  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent('5')

  expect(div).toHaveTextContent('www.testurl.com')
})

// Test which ensures if the 'like' button clicked twice it will be called twice

test('Clicking "Like" twice call event twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'www.testurl.com',
    likes: 5
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('View')
  await user.click(viewButton)
  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
