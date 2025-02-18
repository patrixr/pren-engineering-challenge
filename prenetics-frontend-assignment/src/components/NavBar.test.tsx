import { it, describe, beforeEach, beforeAll, afterAll, afterEach, vi, } from "vitest"
import * as useOrganisationsHooks from "../hooks/organisations"
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event"
import { WithProviders } from "../../testing/helpers"
import NavBar from "./NavBar"
import nock from "nock"

describe("Navbar", () => {
  beforeAll(() => {
    nock.disableNetConnect()
  })

  afterAll(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })

  beforeEach(() => {
    nock("http://localhost:8080").get("/test/v1.0/org").reply(200, {
      data: [
        {
          "id": "7d3a94e7-54b3-43fe-9c52-4fb64e38c588",
          "type": "organisation",
          "attributes": {
            "name": "Prenetics"
          }
        },
        {
          "id": "2bbae3b6-54c6-4b96-b8d4-fe4ebbb70abc",
          "type": "organisation",
          "attributes": {
            "name": "Circle"
          }
        }
      ]
    })
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it("should contain a dropdown of 2 organisations", async (t) => {
    const { container } = render(
      <WithProviders>
        <NavBar />
      </WithProviders>
    )
    await waitFor(() => {
      const [navbar] = container.getElementsByClassName("navbar")
      const [dropdown] = navbar.getElementsByClassName("dropdown")
      const [content] = dropdown.getElementsByClassName("dropdown-content")
      const items = content.getElementsByTagName("li")
      
      t.expect(items).toHaveLength(2)
      t.expect(items[0].textContent).toBe("Prenetics")
      t.expect(items[1].textContent).toBe("Circle")
    })
  })

  it("should set selected organisation when clicking on an organisation", async (t) => {
    const setSelectedOrganisationSpy = vi.fn()
    
    vi.spyOn(useOrganisationsHooks, 'useOrganisations').mockImplementation(() => {
      return {
        isLoading: false,
        error: null,
        selectedOrganisation: null,
        setSelectedOrganisation: setSelectedOrganisationSpy,
        organisations: {
          data: [
            {
              "id": "7d3a94e7-54b3-43fe-9c52-4fb64e38c588",
              "type": "organisation",
              "attributes": {
                "name": "Prenetics"
              }
            },
            {
              "id": "2bbae3b6-54c6-4b96-b8d4-fe4ebbb70abc",
              "type": "organisation",
              "attributes": {
                "name": "Circle"
              }
            }
          ]
        }
      }
    })

    const { container } = render(
      <WithProviders>
        <NavBar />
      </WithProviders>
    )

    await waitFor(() => {
      const items = container.getElementsByTagName("li")
      t.expect(items).toHaveLength(2)
    })

    const items = container.getElementsByTagName("li")
    const firstOrg = items.item(0)
    t.expect(firstOrg).to.exist
    await userEvent.click(firstOrg!.getElementsByTagName("a").item(0)!)

    t.expect(setSelectedOrganisationSpy).toHaveBeenCalledWith({
      "id": "7d3a94e7-54b3-43fe-9c52-4fb64e38c588",
      "type": "organisation",
      "attributes": {
        "name": "Prenetics"
      }
    })
  })


  it('should display selected organisation name', async (t) => {
    const selectedOrg = {
      "id": "7d3a94e7-54b3-43fe-9c52-4fb64e38c588",
      "type": "organisation",
      "attributes": {
        "name": "Prenetics"
      }
    }

    vi.spyOn(useOrganisationsHooks, 'useOrganisations').mockImplementation(() => ({
      isLoading: false,
      error: null,
      selectedOrganisation: selectedOrg,
      setSelectedOrganisation: vi.fn(),
      organisations: { data: [selectedOrg] }
    }))

    const { getByRole } = render(
      <WithProviders>
        <NavBar />
      </WithProviders>
    )

    const button = getByRole('button')
    t.expect(button.textContent).toContain('Prenetics')
  })
})