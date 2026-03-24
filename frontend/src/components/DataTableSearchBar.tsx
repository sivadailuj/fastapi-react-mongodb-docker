import { useState } from 'react'
import { InputAdornment, TextField } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'

interface DataTableSearchBarProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string | 'Search...'
}

export default function DataTableSearchBar({
  search,
  onSearchChange,
  searchPlaceholder,
}: DataTableSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(search)

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange?.(value)
  }

  return (
    <TextField
      placeholder={searchPlaceholder}
      variant='outlined'
      size='small'
      value={searchTerm}
      onChange={(e) => handleSearchChange(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon sx={{ color: 'action.active' }} />
            </InputAdornment>
          ),
        },
      }}
      sx={{ maxWidth: 400 }}
    />
  )
}
